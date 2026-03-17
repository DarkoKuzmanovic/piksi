import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/game-store';
import type { PlayerBoard } from '../store/game-store';
import { scoreValidated, scoreSymbols, scoreLargestZone } from '@shared/scoring';
import { useCountUp } from '../hooks/use-count-up';
import { useParticles } from './ParticleCanvas';

export function ScoreBreakdown() {
  const { gameState, playerId, playerNames, nextRound } = useGameStore();
  const particles = useParticles();
  const modalRef = useRef<HTMLDivElement>(null);

  const [visibleRows, setVisibleRows] = useState(0);
  const confettiFired = useRef(false);

  useEffect(() => {
    const timers = [0, 400, 800, 1200, 1800].map((delay, i) =>
      setTimeout(() => setVisibleRows(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

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

  // Counting animations with staggered delays
  const myValidatedAnim = useCountUp(myValidated, 600, 0);
  const opValidatedAnim = useCountUp(opValidated, 600, 0);

  const mySymbolsAnim = useCountUp(mySymbols, 600, 400);
  const opSymbolsAnim = useCountUp(opSymbols, 600, 400);

  const myZoneAnim = useCountUp(myZone, 600, 800);
  const opZoneAnim = useCountUp(opZone, 600, 800);

  const myTotalAnim = useCountUp(myTotal, 600, 1200);
  const opTotalAnim = useCountUp(opTotal, 600, 1200);

  const myCumulativeAnim = useCountUp(myCumulative, 600, 1800);
  const opCumulativeAnim = useCountUp(opCumulative, 600, 1800);

  // Round-win confetti
  if (visibleRows >= 4 && myTotal > opTotal && !confettiFired.current) {
    confettiFired.current = true;
    const el = modalRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      particles.emit('confetti', rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }

  // Winner highlight colors for round total row
  const myTotalColor = visibleRows >= 4
    ? (myTotal > opTotal ? 'text-[var(--color-green)]' : '')
    : '';
  const opTotalColor = visibleRows >= 4
    ? (opTotal > myTotal ? 'text-[var(--color-green)]' : '')
    : '';

  const rowClass = (index: number) =>
    visibleRows >= index
      ? 'animate-slide-up'
      : 'opacity-0';

  const formatSigned = (val: number) => val >= 0 ? `+${val}` : `${val}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-[var(--color-bg)] border-2 border-[var(--color-accent)] rounded-xl p-6 max-w-md w-full mx-4 animate-slide-up"
      >
        <h2 className="text-2xl font-bold text-center text-[var(--color-accent)] mb-6">
          ROUND {round} COMPLETE!
        </h2>

        {/* Score table */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm mb-4">
          {/* Headers */}
          <div className="text-[var(--color-text-muted)]" />
          <div className="text-center font-bold text-[var(--color-blue)] truncate">{myName}</div>
          <div className="text-center font-bold text-[var(--color-red)] truncate">{opName}</div>

          {/* Row 1: Validated */}
          <div className={`text-[var(--color-text-muted)] ${rowClass(1)}`}>Validated</div>
          <div className={`text-center ${rowClass(1)}`}>{myValidatedAnim}</div>
          <div className={`text-center ${rowClass(1)}`}>{opValidatedAnim}</div>

          {/* Row 2: Symbols */}
          <div className={`text-[var(--color-text-muted)] ${rowClass(2)}`}>Symbols</div>
          <div className={`text-center ${rowClass(2)}`}>{formatSigned(mySymbolsAnim)}</div>
          <div className={`text-center ${rowClass(2)}`}>{formatSigned(opSymbolsAnim)}</div>

          {/* Row 3: Zone */}
          <div className={`text-[var(--color-text-muted)] ${rowClass(3)}`}>Zone (x{round === 1 ? 2 : round === 2 ? 3 : 4})</div>
          <div className={`text-center ${rowClass(3)}`}>+{myZoneAnim}</div>
          <div className={`text-center ${rowClass(3)}`}>+{opZoneAnim}</div>

          {/* Divider */}
          <div className={`col-span-3 border-t border-[var(--color-bg-surface)] my-1 ${rowClass(4)}`} />

          {/* Row 4: Round Total */}
          <div className={`font-bold ${rowClass(4)}`}>Round</div>
          <div className={`text-center font-bold text-lg ${myTotalColor} ${rowClass(4)}`}>{myTotalAnim}</div>
          <div className={`text-center font-bold text-lg ${opTotalColor} ${rowClass(4)}`}>{opTotalAnim}</div>

          {/* Another divider */}
          <div className={`col-span-3 border-t border-[var(--color-bg-surface)] my-1 ${rowClass(5)}`} />

          {/* Row 5: Cumulative */}
          <div className={`font-bold text-[var(--color-accent)] ${rowClass(5)}`}>Total</div>
          <div className={`text-center font-bold text-lg text-[var(--color-accent)] ${rowClass(5)}`}>{myCumulativeAnim}</div>
          <div className={`text-center font-bold text-lg text-[var(--color-accent)] ${rowClass(5)}`}>{opCumulativeAnim}</div>
        </div>

        {/* Next round / results button — fade in when all rows visible */}
        <button
          onClick={nextRound}
          className={`
            w-full mt-4 px-6 py-4
            bg-[var(--color-accent)] text-white font-bold text-lg
            border-2 border-[var(--color-accent)]
            rounded-lg
            hover:brightness-110 active:scale-95
            transition-all duration-200
            min-h-[56px]
            ${visibleRows >= 5 ? 'animate-fade-in' : 'opacity-0 pointer-events-none'}
          `}
        >
          {isLastRound ? 'SEE RESULTS' : 'NEXT ROUND'}
        </button>
      </div>
    </div>
  );
}
