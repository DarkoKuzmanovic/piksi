import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebSocket } from 'ws';
import { RoomManager, RESUME_GRACE_MS } from '../../backend/src/room-manager.js';
import { handleMessage } from '../../backend/src/ws-handler.js';

function socket() {
  return { readyState: WebSocket.OPEN, send: vi.fn(), close: vi.fn() } as unknown as WebSocket;
}

describe('player sessions', () => {
  afterEach(() => vi.useRealTimers());

  it('reattaches the same seat and sends the authoritative current game state', () => {
    const manager = new RoomManager();
    const first = socket(); const second = socket(); const resumed = socket();
    const created = manager.createRoom('Fern');
    manager.registerSocket(first, created.roomCode, created.playerId);
    const joined = manager.joinRoom(created.roomCode, 'Moss');
    manager.registerSocket(second, created.roomCode, joined.playerId);
    const room = manager.getRoom(created.roomCode)!;
    manager.startGame(room);
    const original = room.game;
    manager.handleDisconnect(first);
    handleMessage(resumed, { type: 'resume_session', resumeToken: created.resumeToken }, manager);
    expect(manager.getRoomForSocket(resumed)?.playerId).toBe(created.playerId);
    expect(room.game).toBe(original);
    expect(vi.mocked(resumed.send).mock.calls.some(([data]) => JSON.parse(String(data)).type === 'session_resumed')).toBe(true);
    expect(vi.mocked(resumed.send).mock.calls.some(([data]) => JSON.parse(String(data)).type === 'game_state')).toBe(true);
    expect(vi.mocked(second.send).mock.calls.map(([data]) => JSON.parse(String(data))).filter(m => m.type === 'player_connection').map(m => m.connected)).toEqual([false, true]);
  });

  it('rejects invalid and expired tokens and abandons the room after the grace period', () => {
    vi.useFakeTimers();
    const manager = new RoomManager(); const first = socket(); const other = socket();
    const created = manager.createRoom('Fern'); manager.registerSocket(first, created.roomCode, created.playerId);
    const joined = manager.joinRoom(created.roomCode, 'Moss'); manager.registerSocket(other, created.roomCode, joined.playerId);
    const room = manager.getRoom(created.roomCode)!;
    room.rematchRequests.add(created.playerId);
    manager.handleDisconnect(first);
    expect(() => manager.resumeSession(socket(), 'not-a-token')).toThrow('Invalid or expired');
    vi.advanceTimersByTime(RESUME_GRACE_MS);
    expect(room.rematchRequests.size).toBe(0);
    expect(() => manager.resumeSession(socket(), created.resumeToken)).toThrow('Invalid or expired');
    expect(manager.getRoom(created.roomCode)).toBeUndefined();
    expect(vi.mocked(other.send).mock.calls.some(([data]) => JSON.parse(String(data)).type === 'room_abandoned')).toBe(true);
  });

  it('waits for both players to request a rematch before resetting', () => {
    const manager = new RoomManager(); const first = socket(); const other = socket();
    const created = manager.createRoom('Fern'); manager.registerSocket(first, created.roomCode, created.playerId);
    const joined = manager.joinRoom(created.roomCode, 'Moss'); manager.registerSocket(other, created.roomCode, joined.playerId);
    const room = manager.getRoom(created.roomCode)!; manager.startGame(room);
    room.game!.state.phase = 'game_over';
    const completedGame = room.game;
    handleMessage(first, { type: 'play_again' }, manager);
    handleMessage(first, { type: 'play_again' }, manager);
    expect(room.game).toBe(completedGame);
    expect(room.game!.state.phase).toBe('game_over');
    expect([...room.rematchRequests]).toEqual([created.playerId]);
    expect(vi.mocked(other.send).mock.calls.some(([data]) => {
      const message = JSON.parse(String(data));
      return message.type === 'rematch_status' && message.playerIds.includes(created.playerId);
    })).toBe(true);
    const reconnected = socket();
    manager.handleDisconnect(first);
    handleMessage(reconnected, { type: 'resume_session', resumeToken: created.resumeToken }, manager);
    expect(vi.mocked(reconnected.send).mock.calls.some(([data]) => {
      const message = JSON.parse(String(data));
      return message.type === 'session_resumed' && message.rematchPlayerIds.includes(created.playerId);
    })).toBe(true);
    handleMessage(other, { type: 'play_again' }, manager);
    expect(room.game).not.toBe(completedGame);
    expect(room.game!.state.phase).toBe('choose_card');
    expect(room.game!.state.playerIds).toEqual([created.playerId, joined.playerId]);
    expect(room.rematchRequests.size).toBe(0);
  });
});
