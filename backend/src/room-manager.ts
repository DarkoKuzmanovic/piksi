import { WebSocket } from 'ws';
import { randomBytes } from 'node:crypto';
import { GameEngine } from '../../shared/game.js';
import type { ClientGameState } from '../../shared/protocol.js';
import type { MatchState, PlayerBoard, SpaceNumber } from '../../shared/types.js';
import { SPACE_NUMBERS } from '../../shared/constants.js';

export interface Player {
  id: string;
  name: string;
  ws: WebSocket | null;
  resumeToken: string;
  disconnectedAt: number | null;
  expiryTimer: NodeJS.Timeout | null;
}

export interface Room {
  code: string;
  players: Player[];
  game: GameEngine | null;
  rematchRequests: Set<string>;
  lastActivity: number;
}

const ROOM_CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // 23 chars, no I/L/O
const ROOM_CODE_LENGTH = 4;
const STALE_ROOM_MS = 30 * 60 * 1000; // 30 minutes
export const RESUME_GRACE_MS = 2 * 60 * 1000;

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function generateRoomCode(existingCodes: Set<string>): string {
  let code: string;
  do {
    code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
    }
  } while (existingCodes.has(code));
  return code;
}

export function filterStateForPlayer(state: MatchState, playerId: string): ClientGameState {
  // Deep-clone boards so we can redact without mutating the original
  const boards: Record<string, PlayerBoard> = {};
  for (const pid of state.playerIds) {
    const srcBoard = state.boards[pid];
    const board = {} as PlayerBoard;
    for (const n of SPACE_NUMBERS) {
      const space = srcBoard[n];
      if (pid !== playerId && (space.state === 'FACEDOWN_ONLY' || space.state === 'VALIDATED')) {
        // Hide the opponent's facedown card identity
        board[n] = {
          state: space.state,
          topCard: space.topCard,
          bottomCard: null,
        };
      } else {
        board[n] = { ...space };
      }
    }
    boards[pid] = board;
  }

  return {
    roundNumber: state.roundNumber,
    turnNumber: state.turnNumber,
    pickIndex: state.pickIndex,
    activePlayerId: state.activePlayerId,
    phase: state.phase,
    display: state.display,
    boards,
    scores: state.scores,
    playerIds: state.playerIds,
    pendingCard: playerId === state.activePlayerId ? state.pendingCard : null,
    lastTurnTriggered: state.lastTurnTriggered,
  };
}

export class RoomManager {
  private rooms = new Map<string, Room>();
  private socketToRoom = new Map<WebSocket, { roomCode: string; playerId: string }>();

  createRoom(playerName: string): { roomCode: string; playerId: string; resumeToken: string } {
    const existingCodes = new Set(this.rooms.keys());
    const code = generateRoomCode(existingCodes);
    const playerId = generateId();
    const resumeToken = randomBytes(32).toString('hex');

    const room: Room = {
      code,
      players: [{ id: playerId, name: playerName, ws: null, resumeToken, disconnectedAt: null, expiryTimer: null }],
      game: null,
      rematchRequests: new Set(),
      lastActivity: Date.now(),
    };

    this.rooms.set(code, room);
    return { roomCode: code, playerId, resumeToken };
  }

  joinRoom(roomCode: string, playerName: string): { playerId: string; playerNames: Record<string, string>; resumeToken: string } {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) {
      throw new Error('Room not found');
    }
    if (room.players.length >= 2) {
      throw new Error('Room is full');
    }

    const playerId = generateId();
    const resumeToken = randomBytes(32).toString('hex');
    room.players.push({ id: playerId, name: playerName, ws: null, resumeToken, disconnectedAt: null, expiryTimer: null });
    room.lastActivity = Date.now();

    const playerNames: Record<string, string> = {};
    for (const p of room.players) {
      playerNames[p.id] = p.name;
    }

    return { playerId, playerNames, resumeToken };
  }

  registerSocket(ws: WebSocket, roomCode: string, playerId: string): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return;

    if (player.ws && player.ws !== ws) {
      this.socketToRoom.delete(player.ws);
      player.ws.close();
    }
    clearTimeout(player.expiryTimer ?? undefined);
    player.expiryTimer = null;
    player.disconnectedAt = null;

    player.ws = ws;
    this.socketToRoom.set(ws, { roomCode, playerId });
  }

  resumeSession(ws: WebSocket, token: string): { room: Room; player: Player } {
    for (const room of this.rooms.values()) {
      const player = room.players.find(p => p.resumeToken === token);
      if (!player) continue;
      if (player.disconnectedAt !== null && Date.now() - player.disconnectedAt >= RESUME_GRACE_MS) break;
      this.registerSocket(ws, room.code, player.id);
      room.lastActivity = Date.now();
      this.sendToAll(room, { type: 'player_connection', playerId: player.id, connected: true });
      return { room, player };
    }
    throw new Error('Invalid or expired resume token');
  }

  getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }

  getRoomForSocket(ws: WebSocket): { room: Room; playerId: string } | undefined {
    const info = this.socketToRoom.get(ws);
    if (!info) return undefined;

    const room = this.rooms.get(info.roomCode);
    if (!room) return undefined;

    return { room, playerId: info.playerId };
  }

  startGame(room: Room): void {
    if (room.players.length !== 2) {
      throw new Error('Need exactly 2 players to start');
    }
    room.game = new GameEngine(room.players[0].id, room.players[1].id);
    room.lastActivity = Date.now();
  }

  resetGame(room: Room): void {
    if (room.players.length !== 2) {
      throw new Error('Need exactly 2 players to reset');
    }
    room.rematchRequests.clear();
    room.game = new GameEngine(room.players[0].id, room.players[1].id);
    room.lastActivity = Date.now();
  }

  handleDisconnect(ws: WebSocket): void {
    const info = this.socketToRoom.get(ws);
    if (!info) return;

    const room = this.rooms.get(info.roomCode);
    if (room) {
      const player = room.players.find(p => p.id === info.playerId);
      if (player && player.ws === ws) {
        player.ws = null;
        player.disconnectedAt = Date.now();
        this.sendToAll(room, { type: 'player_connection', playerId: player.id, connected: false });
        player.expiryTimer = setTimeout(() => {
          if (player.ws || player.disconnectedAt === null) return;
          room.rematchRequests.clear();
          this.sendToAll(room, { type: 'room_abandoned', message: `${player.name} did not reconnect in time.` });
          for (const participant of room.players) {
            clearTimeout(participant.expiryTimer ?? undefined);
            if (participant.ws) this.socketToRoom.delete(participant.ws);
          }
          this.rooms.delete(room.code);
        }, RESUME_GRACE_MS);
        player.expiryTimer.unref();
      }
      room.lastActivity = Date.now();
    }

    this.socketToRoom.delete(ws);
  }

  broadcastGameState(room: Room): void {
    if (!room.game) return;

    for (const player of room.players) {
      if (player.ws && player.ws.readyState === WebSocket.OPEN) {
        const filtered = filterStateForPlayer(room.game.state, player.id);
        player.ws.send(JSON.stringify({ type: 'game_state', state: filtered }));
      }
    }
  }

  sendToPlayer(room: Room, playerId: string, message: object): void {
    const player = room.players.find(p => p.id === playerId);
    if (player?.ws && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(message));
    }
  }

  sendToAll(room: Room, message: object): void {
    const data = JSON.stringify(message);
    for (const player of room.players) {
      if (player.ws && player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(data);
      }
    }
  }

  cleanupStaleRooms(): void {
    const now = Date.now();
    for (const [code, room] of this.rooms) {
      if (now - room.lastActivity > STALE_ROOM_MS) {
        // Close any remaining sockets
        for (const player of room.players) {
          clearTimeout(player.expiryTimer ?? undefined);
          if (player.ws) {
            this.socketToRoom.delete(player.ws);
            player.ws.close();
          }
        }
        this.rooms.delete(code);
      }
    }
  }
}
