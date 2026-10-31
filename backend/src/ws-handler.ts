import { WebSocket } from 'ws';
import type { ClientMessage } from '../../shared/protocol.js';
import type { RoomManager } from './room-manager.js';
import type { SpaceNumber } from '../../shared/types.js';

export function handleMessage(ws: WebSocket, data: ClientMessage, roomManager: RoomManager): void {
  switch (data.type) {
    case 'create_room':
      handleCreateRoom(ws, data.playerName, roomManager);
      break;
    case 'join_room':
      handleJoinRoom(ws, data.roomCode, data.playerName, roomManager);
      break;
    case 'resume_session':
      try {
        if (typeof data.resumeToken !== 'string' || !data.resumeToken) throw new Error('Invalid or expired resume token');
        const { room, player } = roomManager.resumeSession(ws, data.resumeToken);
        ws.send(JSON.stringify({
          type: 'session_resumed', roomCode: room.code, playerId: player.id,
          playerNames: Object.fromEntries(room.players.map(p => [p.id, p.name])),
          disconnectedPlayerIds: room.players.filter(p => !p.ws).map(p => p.id),
          rematchPlayerIds: [...room.rematchRequests],
        }));
        roomManager.broadcastGameState(room);
      } catch {
        ws.send(JSON.stringify({ type: 'resume_rejected', message: 'Your session has expired. Start or join a new game.' }));
      }
      break;
    case 'choose_card':
      handleGameAction(ws, roomManager, (playerId, room) => {
        room.game!.chooseCard(playerId, data.cardTypeId);
      });
      break;
    case 'choose_keep':
      handleGameAction(ws, roomManager, (playerId, room) => {
        room.game!.chooseKeep(playerId, data.keepNew);
      });
      break;
    case 'choose_space':
      handleGameAction(ws, roomManager, (playerId, room) => {
        room.game!.chooseSpace(playerId, data.targetSpace as SpaceNumber);
      });
      break;
    case 'next_round':
      handleGameAction(ws, roomManager, (_playerId, room) => {
        if (room.game!.state.phase === 'round_scoring') {
          room.game!.nextRound();
        }
        // Silently ignore if already advanced (other player triggered it first)
      });
      break;
    case 'play_again':
      handlePlayAgain(ws, roomManager);
      break;
    default:
      sendError(ws, 'Unknown message type');
  }
}

function handleCreateRoom(ws: WebSocket, playerName: string, roomManager: RoomManager): void {
  if (!playerName || typeof playerName !== 'string') {
    sendError(ws, 'Player name is required');
    return;
  }

  const { roomCode, playerId, resumeToken } = roomManager.createRoom(playerName.trim());
  roomManager.registerSocket(ws, roomCode, playerId);

  ws.send(JSON.stringify({
    type: 'room_created',
    roomCode,
    playerId,
    resumeToken,
  }));
}

function handleJoinRoom(ws: WebSocket, roomCode: string, playerName: string, roomManager: RoomManager): void {
  if (!playerName || typeof playerName !== 'string') {
    sendError(ws, 'Player name is required');
    return;
  }
  if (!roomCode || typeof roomCode !== 'string') {
    sendError(ws, 'Room code is required');
    return;
  }

  try {
    const { playerId, playerNames, resumeToken } = roomManager.joinRoom(roomCode.trim(), playerName.trim());
    const room = roomManager.getRoom(roomCode.trim().toUpperCase())!;

    roomManager.registerSocket(ws, room.code, playerId);

    // Send room_joined to the joining player
    ws.send(JSON.stringify({
      type: 'room_joined',
      playerId,
      roomCode: room.code,
      resumeToken,
      playerNames,
    }));

    // Notify the other player that someone joined
    const otherPlayer = room.players.find(p => p.id !== playerId);
    if (otherPlayer?.ws && otherPlayer.ws.readyState === WebSocket.OPEN) {
      otherPlayer.ws.send(JSON.stringify({
        type: 'player_joined',
        playerId,
        playerName: playerName.trim(),
      }));
    }

    // Both players are in — start the game
    if (room.players.length === 2) {
      roomManager.startGame(room);
      roomManager.sendToAll(room, { type: 'game_started' });
      roomManager.broadcastGameState(room);
      for (const participant of room.players) {
        if (!participant.ws) roomManager.sendToAll(room, { type: 'player_connection', playerId: participant.id, connected: false });
      }
    }
  } catch (err) {
    sendError(ws, err instanceof Error ? err.message : 'Failed to join room');
  }
}

function handleGameAction(
  ws: WebSocket,
  roomManager: RoomManager,
  action: (playerId: string, room: ReturnType<RoomManager['getRoom']> & {}) => void,
): void {
  const info = roomManager.getRoomForSocket(ws);
  if (!info) {
    sendError(ws, 'Not in a room');
    return;
  }

  const { room, playerId } = info;
  if (!room.game) {
    sendError(ws, 'Game has not started');
    return;
  }

  try {
    action(playerId, room);
    room.lastActivity = Date.now();
    roomManager.broadcastGameState(room);
  } catch (err) {
    sendError(ws, err instanceof Error ? err.message : 'Action failed');
  }
}

function handlePlayAgain(ws: WebSocket, roomManager: RoomManager): void {
  const info = roomManager.getRoomForSocket(ws);
  if (!info) {
    sendError(ws, 'Not in a room');
    return;
  }

  const { room, playerId } = info;
  if (!room.game) {
    sendError(ws, 'Game has not started');
    return;
  }

  if (room.game.state.phase !== 'game_over') {
    sendError(ws, 'Game is not over yet');
    return;
  }

  try {
    room.rematchRequests.add(playerId);
    room.lastActivity = Date.now();
    roomManager.sendToAll(room, { type: 'rematch_status', playerIds: [...room.rematchRequests] });
    if (room.rematchRequests.size < room.players.length) return;
    roomManager.resetGame(room);
    roomManager.sendToAll(room, { type: 'game_started' });
    roomManager.broadcastGameState(room);
  } catch (err) {
    sendError(ws, err instanceof Error ? err.message : 'Failed to restart game');
  }
}

function sendError(ws: WebSocket, message: string): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'error', message }));
  }
}
