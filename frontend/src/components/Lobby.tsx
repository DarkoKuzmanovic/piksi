import { useState } from 'react';
import { useGameStore } from '../store/game-store';

export function Lobby() {
  const [playerName, setPlayerName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const { createRoom, joinRoom, lobbyState, roomCode, errorMessage, clearError, connectionStatus } = useGameStore();

  const isConnecting = connectionStatus === 'connecting';

  function handleCreate() {
    if (!playerName.trim()) return;
    clearError();
    createRoom(playerName.trim());
  }

  function handleJoin() {
    if (!playerName.trim() || roomCodeInput.length < 4) return;
    clearError();
    joinRoom(roomCodeInput.toUpperCase(), playerName.trim());
  }

  // Waiting for opponent screen
  if (lobbyState === 'waiting' && roomCode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-bold text-[var(--color-accent)] mb-2 tracking-wider">
          PIKSI
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8">Waiting for opponent...</p>

        <div className="bg-[var(--color-bg-surface)] border-2 border-[var(--color-accent)] rounded-xl p-6 mb-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)] mb-2">ROOM CODE</p>
          <p className="text-4xl font-bold tracking-[0.3em] text-[var(--color-accent)]">
            {roomCode}
          </p>
        </div>

        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Share this code with your opponent
        </p>

        <div className="animate-waiting text-2xl">
          . . .
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Title */}
      <h1 className="text-6xl font-bold text-[var(--color-accent)] mb-1 tracking-wider">
        PIKSI
      </h1>
      <p className="text-[var(--color-text-muted)] mb-10 text-lg">
        A game of pixies & cards
      </p>

      {/* Error toast */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-red)] text-white px-4 py-2 rounded-lg font-bold text-sm animate-fade-in">
          {errorMessage}
        </div>
      )}

      {/* Name input */}
      <input
        type="text"
        placeholder="Your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        maxLength={16}
        className="
          w-full max-w-xs px-4 py-3 mb-6
          bg-[var(--color-bg-card)] border-2 border-[var(--color-bg-surface)]
          rounded-lg text-center text-lg text-[var(--color-text)]
          placeholder:text-[var(--color-text-muted)]
          focus:outline-none focus:border-[var(--color-accent)]
          transition-colors duration-200
        "
      />

      {/* Create Game button */}
      <button
        onClick={handleCreate}
        disabled={!playerName.trim() || lobbyState === 'creating' || isConnecting}
        className="
          w-full max-w-xs px-6 py-4 mb-6
          bg-[var(--color-accent)] text-white font-bold text-xl
          border-2 border-[var(--color-accent)]
          rounded-lg
          hover:brightness-110 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
          min-h-[56px]
        "
      >
        {lobbyState === 'creating' || isConnecting ? 'CONNECTING...' : 'CREATE GAME'}
      </button>

      {/* Divider */}
      <div className="flex items-center w-full max-w-xs mb-6">
        <div className="flex-1 h-px bg-[var(--color-bg-surface)]" />
        <span className="px-4 text-sm text-[var(--color-text-muted)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-bg-surface)]" />
      </div>

      {/* Join section */}
      <div className="flex gap-2 w-full max-w-xs">
        <input
          type="text"
          placeholder="CODE"
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase().slice(0, 4))}
          maxLength={4}
          className="
            flex-1 px-4 py-3
            bg-[var(--color-bg-card)] border-2 border-[var(--color-bg-surface)]
            rounded-lg text-center text-lg text-[var(--color-text)]
            tracking-[0.2em] uppercase
            placeholder:text-[var(--color-text-muted)] placeholder:tracking-normal
            focus:outline-none focus:border-[var(--color-accent)]
            transition-colors duration-200
          "
        />
        <button
          onClick={handleJoin}
          disabled={!playerName.trim() || roomCodeInput.length < 4 || lobbyState === 'joining' || isConnecting}
          className="
            px-6 py-3
            bg-[var(--color-bg-surface)] text-[var(--color-accent)] font-bold text-lg
            border-2 border-[var(--color-accent)]
            rounded-lg
            hover:bg-[var(--color-accent)] hover:text-white
            active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
            min-h-[52px]
          "
        >
          {lobbyState === 'joining' ? '...' : 'JOIN'}
        </button>
      </div>
    </div>
  );
}
