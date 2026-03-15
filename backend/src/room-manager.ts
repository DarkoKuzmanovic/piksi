import { WebSocket } from 'ws';
import { GameEngine } from '../../shared/game.js';
import type { ClientGameState } from './protocol.js';
import type { MatchState, PlayerBoard, SpaceNumber } from '../../shared/types.js';
import { SPACE_NUMBERS } from '../../shared/constants.js';

export interface Player {
  id: string;
  name: string;
  ws: WebSocket | null;
}

export interface Room {
  code: string;
  players: Player[];
  game: GameEngine | null;
  lastActivity: number;
}

const ROOM_CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // 23 chars, no I/L/O
const ROOM_CODE_LENGTH = 4;
const STALE_ROOM_MS = 30 * 60 * 1000; // 30 minutes

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

  createRoom(playerName: string): { roomCode: string; playerId: string } {
    const existingCodes = new Set(this.rooms.keys());
    const code = generateRoomCode(existingCodes);
    const playerId = generateId();

    const room: Room = {
      code,
      players: [{ id: playerId, name: playerName, ws: null }],
      game: null,
      lastActivity: Date.now(),
    };

    this.rooms.set(code, room);
    return { roomCode: code, playerId };
  }

  joinRoom(roomCode: string, playerName: string): { playerId: string; playerNames: Record<string, string> } {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) {
      throw new Error('Room not found');
    }
    if (room.players.length >= 2) {
      throw new Error('Room is full');
    }

    const playerId = generateId();
    room.players.push({ id: playerId, name: playerName, ws: null });
    room.lastActivity = Date.now();

    const playerNames: Record<string, string> = {};
    for (const p of room.players) {
      playerNames[p.id] = p.name;
    }

    return { playerId, playerNames };
  }

  registerSocket(ws: WebSocket, roomCode: string, playerId: string): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return;

    player.ws = ws;
    this.socketToRoom.set(ws, { roomCode, playerId });
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
    room.game = new GameEngine(room.players[0].id, room.players[1].id);
    room.lastActivity = Date.now();
  }

  handleDisconnect(ws: WebSocket): void {
    const info = this.socketToRoom.get(ws);
    if (!info) return;

    const room = this.rooms.get(info.roomCode);
    if (room) {
      const player = room.players.find(p => p.id === info.playerId);
      if (player) {
        player.ws = null;
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
