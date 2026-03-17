import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/game-store';
import type { SpaceNumber } from '../store/game-store';
import { usePrevious } from '../hooks/use-previous';
import { useParticles } from './ParticleCanvas';
import { PlayerGrid } from './PlayerGrid';
import { Display } from './Display';
import { ChooseKeepModal } from './ChooseKeepModal';

export function GameBoard() {
  const {
    gameState,
    playerId,
    playerNames,
    isMyTurn,
    myBoard,
    opponentBoard,
    opponentId,
    chooseCard,
    chooseKeep,
    chooseSpace,
  } = useGameStore();

  if (!gameState || !playerId) return null;

  const myBoardData = myBoard();
  const opBoardData = opponentBoard();
  const opId = opponentId();

  if (!myBoardData || !opBoardData || !opId) return null;

  const myName = playerNames[playerId] ?? 'You';
  const opName = playerNames[opId] ?? 'Opponent';

  const myTurn = isMyTurn();
  const phase = gameState.phase;

  // Turn-change flash
  const [turnFlash, setTurnFlash] = useState(false);
  const prevMyTurn = usePrevious(myTurn);
  useEffect(() => {
    if (prevMyTurn === false && myTurn === true) {
      setTurnFlash(true);
      const timer = setTimeout(() => setTurnFlash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [myTurn, prevMyTurn]);

  // Last-turn embers
  const particles = useParticles();
  const statusBarRef = useRef<HTMLDivElement>(null);
  const prevLastTurn = usePrevious(gameState?.lastTurnTriggered);
  useEffect(() => {
    if (!prevLastTurn && gameState?.lastTurnTriggered && statusBarRef.current) {
      const rect = statusBarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      particles.emit('embers', centerX, centerY);
    }
  }, [gameState?.lastTurnTriggered, prevLastTurn, particles]);

  // Determine which spaces to highlight (Case 3: choose_space)
  const highlightSpaces: SpaceNumber[] = [];
  if (phase === 'choose_space' && myTurn) {
    // Find empty spaces on my board
    for (let i = 1; i <= 9; i++) {
      const n = i as SpaceNumber;
      if (myBoardData[n].state === 'EMPTY') {
        highlightSpaces.push(n);
      }
    }
  }

  // My score and opponent score
  const myScores = gameState.scores[playerId] ?? [];
  const opScores = gameState.scores[opId] ?? [];
  const myTotalScore = myScores.reduce((a, b) => a + b, 0);
  const opTotalScore = opScores.reduce((a, b) => a + b, 0);

  // Turn indicator text
  let statusText: string;
  if (phase === 'choose_card') {
    statusText = myTurn ? 'YOUR TURN \u2014 Pick a card!' : `Waiting for ${opName}...`;
  } else if (phase === 'choose_keep') {
    statusText = myTurn ? 'Choose which card stays faceup' : `Waiting for ${opName}...`;
  } else if (phase === 'choose_space') {
    statusText = myTurn ? 'Choose an empty space' : `Waiting for ${opName}...`;
  } else {
    statusText = '';
  }

  return (
    <div className="flex-1 flex flex-col h-dvh overflow-hidden">
      {/* Opponent header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-bg-card)] border-b border-[var(--color-bg-surface)]">
        <span className="font-bold text-sm text-[var(--color-red)] truncate max-w-[60%]">{opName}</span>
        <span className="text-sm text-[var(--color-text-muted)]">Score: {opTotalScore}</span>
      </div>

      {/* Opponent grid */}
      <div className="flex justify-center py-2 shrink-0">
        <PlayerGrid
          board={opBoardData}
          isOwn={false}
          small
        />
      </div>

      {/* Display area */}
      <div className="flex justify-center py-2 shrink-0">
        <Display
          cards={gameState.display}
          canPick={myTurn && phase === 'choose_card'}
          onPick={chooseCard}
        />
      </div>

      {/* Status bar */}
      <div
        ref={statusBarRef}
        className={`
          text-center py-2 px-4 text-sm font-bold shrink-0
          ${myTurn
            ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
            : 'bg-[var(--color-bg-surface)]/30 text-[var(--color-text-muted)] animate-waiting'
          }
          ${turnFlash ? 'animate-turn-flash' : ''}
        `}
      >
        <div key={statusText} className="animate-fade-in">{statusText}</div>
        <div className="text-xs text-[var(--color-text-muted)] font-normal mt-0.5">
          Round {gameState.roundNumber} &middot; Turn {gameState.turnNumber}
          {gameState.lastTurnTriggered && ' \u2014 LAST TURN'}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-0" />

      {/* Own grid */}
      <div className="flex justify-center py-2 shrink-0">
        <PlayerGrid
          board={myBoardData}
          isOwn
          highlightSpaces={highlightSpaces}
          onSpaceClick={myTurn && phase === 'choose_space' ? chooseSpace : undefined}
        />
      </div>

      {/* Own footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-bg-card)] border-t border-[var(--color-bg-surface)]">
        <span className="font-bold text-sm text-[var(--color-blue)] truncate max-w-[60%]">{myName}</span>
        <span className="text-sm text-[var(--color-text-muted)]">Score: {myTotalScore}</span>
      </div>

      {/* Choose Keep Modal */}
      {phase === 'choose_keep' && myTurn && gameState.pendingCard && (() => {
        // Find the existing faceup card at the pending card's space
        const spaceNum = gameState.pendingCard.number;
        const existingCard = myBoardData[spaceNum]?.topCard;
        if (!existingCard) return null;
        return (
          <ChooseKeepModal
            existingCard={existingCard}
            pendingCard={gameState.pendingCard}
            onChoose={chooseKeep}
          />
        );
      })()}
    </div>
  );
}
