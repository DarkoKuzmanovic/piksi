import { useEffect } from 'react';
import { useGameStore } from '../store/game-store';
import { useParticles } from './ParticleCanvas';

export function GameOver() {
  const { gameState, playerId, playerNames, playAgain } = useGameStore();
  const particles = useParticles();

  if (!gameState || !playerId) return null;

  const opponentId = gameState.playerIds.find(id => id !== playerId);
  if (!opponentId) return null;

  const myScores = gameState.scores[playerId] ?? [];
  const opScores = gameState.scores[opponentId] ?? [];
  const myTotal = myScores.reduce((a, b) => a + b, 0);
  const opTotal = opScores.reduce((a, b) => a + b, 0);

  const myName = playerNames[playerId] ?? 'You';
  const opName = playerNames[opponentId] ?? 'Opponent';

  let resultText: string;
  let resultColor: string;
  if (myTotal > opTotal) {
    resultText = 'YOU WIN!';
    resultColor = 'text-[var(--color-green)]';
  } else if (opTotal > myTotal) {
    resultText = `${opName} WINS!`;
    resultColor = 'text-[var(--color-red)]';
  } else {
    resultText = 'TIE!';
    resultColor = 'text-[var(--color-yellow)]';
  }

  useEffect(() => {
    if (myTotal > opTotal) {
      particles.emit('confetti', window.innerWidth / 2, window.innerHeight / 3);
    }
  }, [particles, myTotal, opTotal]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Trophy animation */}
      <div className="text-6xl mb-4 animate-trophy">
        {myTotal > opTotal ? '\u2605' : myTotal === opTotal ? '\u2606' : '\u2606'}
      </div>

      <h1 className={`text-4xl font-bold mb-2 ${resultColor}`}>
        {resultText}
      </h1>

      <p className="text-[var(--color-text-muted)] mb-8">Game Over</p>

      {/* Score table */}
      <div className="bg-[var(--color-bg-card)] border-2 border-[var(--color-bg-surface)] rounded-xl p-5 mb-8 w-full max-w-sm">
        <div className="grid grid-cols-5 gap-y-2 text-sm">
          {/* Headers */}
          <div className="text-[var(--color-text-muted)] text-left" />
          <div className="text-center text-[var(--color-text-muted)]">R1</div>
          <div className="text-center text-[var(--color-text-muted)]">R2</div>
          <div className="text-center text-[var(--color-text-muted)]">R3</div>
          <div className="text-center font-bold text-[var(--color-accent)]">Total</div>

          {/* Your scores */}
          <div className="text-[var(--color-blue)] font-bold truncate pr-2">{myName}</div>
          <div className="text-center">{myScores[0] ?? '-'}</div>
          <div className="text-center">{myScores[1] ?? '-'}</div>
          <div className="text-center">{myScores[2] ?? '-'}</div>
          <div className="text-center font-bold text-lg">{myTotal}</div>

          {/* Opponent scores */}
          <div className="text-[var(--color-red)] font-bold truncate pr-2">{opName}</div>
          <div className="text-center">{opScores[0] ?? '-'}</div>
          <div className="text-center">{opScores[1] ?? '-'}</div>
          <div className="text-center">{opScores[2] ?? '-'}</div>
          <div className="text-center font-bold text-lg">{opTotal}</div>
        </div>
      </div>

      {/* Play again button */}
      <button
        onClick={playAgain}
        className="
          w-full max-w-xs px-6 py-4
          bg-[var(--color-accent)] text-white font-bold text-xl
          border-2 border-[var(--color-accent)]
          rounded-lg
          hover:brightness-110 active:scale-95
          transition-all duration-200
          min-h-[56px]
        "
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
