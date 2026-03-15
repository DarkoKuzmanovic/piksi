import { WebSocket } from 'ws';
import type { ClientMessage } from './protocol';
import type { RoomManager } from './room-manager';
import type { SpaceNumber } from '../../shared/types';

export function handleMessage(ws: WebSocket, data: ClientMessage, roomManager: RoomManager): void {
  switch (data.type) {
    case 'create_room':
      handleCreateRoom(ws, data.playerName, roomManager);
      break;
    case 'join_room':
      handleJoinRoom(ws, data.roomCode, data.playerName, roomManager);
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

  const { roomCode, playerId } = roomManager.createRoom(playerName.trim());
  roomManager.registerSocket(ws, roomCode, playerId);

  ws.send(JSON.stringify({
    type: 'room_created',
    roomCode,
    playerId,
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
    const { playerId, playerNames } = roomManager.joinRoom(roomCode.trim(), playerName.trim());
    const room = roomManager.getRoom(roomCode.trim().toUpperCase())!;

    roomManager.registerSocket(ws, room.code, playerId);

    // Send room_joined to the joining player
    ws.send(JSON.stringify({
      type: 'room_joined',
      playerId,
      playerNames,
    }));

    // Notify the other player that someone joined
    const otherPlayer = room.players.find(p => p.id !== playerId);
    if (otherPlayer?.ws && otherPlayer.ws.readyState === WebSocket.OPEN) {
      otherPlayer.ws.send(JSON.stringify({
        type: 'player_joined',
        playerName: playerName.trim(),
      }));
    }

    // Both players are in — start the game
    if (room.players.length === 2) {
      roomManager.startGame(room);
      roomManager.sendToAll(room, { type: 'game_started' });
      roomManager.broadcastGameState(room);
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

  const { room } = info;
  if (!room.game) {
    sendError(ws, 'Game has not started');
    return;
  }

  if (room.game.state.phase !== 'game_over') {
    sendError(ws, 'Game is not over yet');
    return;
  }

  try {
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
