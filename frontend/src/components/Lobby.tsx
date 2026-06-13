import { useState, useEffect } from 'react';
import { useGameStore } from '../store/game-store';
import { useParticles } from './ParticleCanvas';

export function Lobby() {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem('piksi-player-name') || ''
  );
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { createRoom, joinRoom, lobbyState, roomCode, errorMessage, clearError, connectionStatus } = useGameStore();
  const particles = useParticles();

  const isConnecting = connectionStatus === 'connecting';

  // Persist name to localStorage
  useEffect(() => {
    if (playerName) localStorage.setItem('piksi-player-name', playerName);
  }, [playerName]);

  // Ambient sparkle particles
  useEffect(() => {
    const id = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      particles.emit('sparkle', x, y);
    }, 2500);
    return () => clearInterval(id);
  }, [particles]);

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

  function handleCopyCode() {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Waiting for opponent screen
  if (lobbyState === 'waiting' && roomCode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-bold wordmark mb-2 tracking-wider animate-pulse-glow rounded-lg">
          PIKSI
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          Waiting for opponent...
        </p>

        <div
          onClick={handleCopyCode}
          className="bg-[var(--color-bg-surface)] border-2 border-[var(--color-accent)] rounded-xl p-6 mb-4 text-center cursor-pointer animate-pulse-border animate-slide-up opacity-0 hover:brightness-110 transition-all"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          title="Click to copy"
        >
          <p className="text-sm text-[var(--color-text-muted)] mb-2">ROOM CODE</p>
          <p className="text-4xl font-bold tracking-[0.3em] text-[var(--color-accent)]">
            {roomCode}
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          className="text-sm text-[var(--color-text-muted)] mb-6 hover:text-[var(--color-accent)] transition-colors animate-slide-up opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          {copied ? 'Copied!' : 'Tap to copy \u00b7 Share with your opponent'}
        </button>

        <div className="animate-waiting">
          <div className="lobby-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-0">
      {/* Error toast */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-red)] text-white px-4 py-2 rounded-lg font-bold text-sm animate-fade-in">
          {errorMessage}
        </div>
      )}

      {/* Card fan + Title */}
      <div className="relative mb-[12px] animate-slide-up opacity-0" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
        {/* Decorative card fan behind title */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <div className="card-back-pattern w-10 h-14 rounded border border-[var(--color-accent)]/30 absolute -rotate-[25deg] -translate-x-8 opacity-40" />
          <div className="card-back-pattern w-10 h-14 rounded border border-[var(--color-accent)]/30 absolute opacity-50" />
          <div className="card-back-pattern w-10 h-14 rounded border border-[var(--color-accent)]/30 absolute rotate-[25deg] translate-x-8 opacity-40" />
        </div>
        <h1 className="text-6xl font-bold wordmark tracking-wider animate-pulse-glow rounded-lg px-4 py-2">
          PIKSI
        </h1>
      </div>
      <p className="text-[var(--color-text-muted)] text-lg animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards', marginBottom: '48px' }}>
        A game of pixies & cards
      </p>

      {/* Name input */}
      <input
        type="text"
        placeholder="Your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        maxLength={16}
        className="
          w-full max-w-xs px-4 py-3
          bg-[var(--color-bg-card)] border-2 border-[var(--color-bg-surface)]
          rounded-lg text-center text-lg text-[var(--color-text)]
          placeholder:text-[var(--color-text-muted)]
          focus:outline-none focus:border-[var(--color-accent)]
          transition-colors duration-200
          animate-slide-up opacity-0
        "
        style={{ animationDelay: '0.2s', animationFillMode: 'forwards', marginBottom: '28px' }}
      />

      {/* Create Game button */}
      <button
        onClick={handleCreate}
        disabled={!playerName.trim() || lobbyState === 'creating' || isConnecting}
        className="
          w-full max-w-xs px-6 py-4
          bg-[var(--color-accent)] text-white font-bold text-xl
          border-2 border-[var(--color-accent)]
          rounded-lg
          hover:brightness-110 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
          min-h-[56px]
          animate-slide-up opacity-0
        "
        style={{ animationDelay: '0.3s', animationFillMode: 'forwards', marginBottom: '28px' }}
      >
        {lobbyState === 'creating' || isConnecting ? 'CONNECTING...' : 'CREATE GAME'}
      </button>

      {/* Divider */}
      <div className="flex items-center w-full max-w-xs animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', marginBottom: '28px' }}>
        <div className="flex-1 h-px bg-[var(--color-bg-surface)]" />
        <span className="px-4 text-sm text-[var(--color-text-muted)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-bg-surface)]" />
      </div>

      {/* Join section */}
      <div className="flex gap-2 w-full max-w-xs animate-slide-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
        <input
          type="text"
          placeholder="CODE"
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase().slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
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

      {/* Version footer */}
      <p className="absolute bottom-4 text-xs text-[var(--color-text-muted)] opacity-50">
        piksi.quz.ma
      </p>
    </div>
  );
}
