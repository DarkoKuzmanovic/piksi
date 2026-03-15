import { useGameStore } from '../store/game-store';
import type { PlayerBoard } from '../store/game-store';

// We need scoring functions from shared
// Since we alias @shared, we import from there
import { scoreValidated, scoreSymbols, scoreLargestZone } from '@shared/scoring';

export function ScoreBreakdown() {
  const { gameState, playerId, playerNames, nextRound } = useGameStore();

  if (!gameState || !playerId) return null;

  const opponentId = gameState.playerIds.find(id => id !== playerId);
  if (!opponentId) return null;

  const round = gameState.roundNumber;
  const myBoard = gameState.boards[playerId] as PlayerBoard;
  const opBoard = gameState.boards[opponentId] as PlayerBoard;

  const myValidated = scoreValidated(myBoard);
  const mySymbols = scoreSymbols(myBoard);
  const myZone = scoreLargestZone(myBoard, round);
  const myTotal = myValidated + mySymbols + myZone;

  const opValidated = scoreValidated(opBoard);
  const opSymbols = scoreSymbols(opBoard);
  const opZone = scoreLargestZone(opBoard, round);
  const opTotal = opValidated + opSymbols + opZone;

  const myCumulative = gameState.scores[playerId].reduce((a, b) => a + b, 0);
  const opCumulative = gameState.scores[opponentId].reduce((a, b) => a + b, 0);

  const myName = playerNames[playerId] ?? 'You';
  const opName = playerNames[opponentId] ?? 'Opponent';

  const isLastRound = round >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="bg-[var(--color-bg)] border-2 border-[var(--color-accent)] rounded-xl p-6 max-w-md w-full mx-4 animate-slide-up">
        <h2 className="text-2xl font-bold text-center text-[var(--color-accent)] mb-6">
          ROUND {round} COMPLETE!
        </h2>

        {/* Score table */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm mb-4">
          {/* Headers */}
          <div className="text-[var(--color-text-muted)]" />
          <div className="text-center font-bold text-[var(--color-blue)] truncate">{myName}</div>
          <div className="text-center font-bold text-[var(--color-red)] truncate">{opName}</div>

          {/* Validated */}
          <div className="text-[var(--color-text-muted)]">Validated</div>
          <div className="text-center">{myValidated}</div>
          <div className="text-center">{opValidated}</div>

          {/* Symbols */}
          <div className="text-[var(--color-text-muted)]">Symbols</div>
          <div className="text-center">{mySymbols >= 0 ? `+${mySymbols}` : mySymbols}</div>
          <div className="text-center">{opSymbols >= 0 ? `+${opSymbols}` : opSymbols}</div>

          {/* Zone */}
          <div className="text-[var(--color-text-muted)]">Zone (x{round === 1 ? 2 : round === 2 ? 3 : 4})</div>
          <div className="text-center">+{myZone}</div>
          <div className="text-center">+{opZone}</div>

          {/* Divider */}
          <div className="col-span-3 border-t border-[var(--color-bg-surface)] my-1" />

          {/* Total */}
          <div className="font-bold">Round</div>
          <div className="text-center font-bold text-lg">{myTotal}</div>
          <div className="text-center font-bold text-lg">{opTotal}</div>

          {/* Another divider */}
          <div className="col-span-3 border-t border-[var(--color-bg-surface)] my-1" />

          {/* Cumulative */}
          <div className="font-bold text-[var(--color-accent)]">Total</div>
          <div className="text-center font-bold text-lg text-[var(--color-accent)]">{myCumulative}</div>
          <div className="text-center font-bold text-lg text-[var(--color-accent)]">{opCumulative}</div>
        </div>

        {/* Next round / results button */}
        <button
          onClick={nextRound}
          className="
            w-full mt-4 px-6 py-4
            bg-[var(--color-accent)] text-white font-bold text-lg
            border-2 border-[var(--color-accent)]
            rounded-lg
            hover:brightness-110 active:scale-95
            transition-all duration-200
            min-h-[56px]
          "
        >
          {isLastRound ? 'SEE RESULTS' : 'NEXT ROUND'}
        </button>
      </div>
    </div>
  );
}
