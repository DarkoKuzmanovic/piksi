import { useEffect } from 'react';
import { useGameStore } from './store/game-store';
import { Lobby } from './components/Lobby';
import { GameBoard } from './components/GameBoard';
import { ScoreBreakdown } from './components/ScoreBreakdown';
import { GameOver } from './components/GameOver';

export default function App() {
  const {
    connect,
    roomCode,
    lobbyState,
    gameState,
    errorMessage,
  } = useGameStore();

  // Connect WebSocket on mount
  useEffect(() => {
    connect();
  }, [connect]);

  // Error toast (shown globally)
  const errorToast = errorMessage ? (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[var(--color-red)] text-white px-4 py-2 rounded-lg font-bold text-sm animate-fade-in shadow-lg">
      {errorMessage}
    </div>
  ) : null;

  // Route based on state
  let content: React.ReactNode;

  if (!roomCode && !gameState) {
    // No room, no game => Lobby
    content = <Lobby />;
  } else if (roomCode && lobbyState === 'waiting' && !gameState) {
    // Room created, waiting for opponent (handled inside Lobby)
    content = <Lobby />;
  } else if (gameState?.phase === 'game_over') {
    content = <GameOver />;
  } else if (gameState) {
    content = (
      <>
        <GameBoard />
        {gameState.phase === 'round_scoring' && <ScoreBreakdown />}
      </>
    );
  } else {
    // Fallback: still in lobby/joining state
    content = <Lobby />;
  }

  return (
    <>
      {errorToast}
      {content}
    </>
  );
}
