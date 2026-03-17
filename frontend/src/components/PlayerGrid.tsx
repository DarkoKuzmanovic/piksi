import { useState, useEffect, useRef } from 'react';
import type { PlayerBoard, SpaceNumber } from '../store/game-store';
import { Card } from './Card';
import { usePrevious } from '../hooks/use-previous';
import { useParticles } from './ParticleCanvas';

const SPACE_ORDER: SpaceNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface PlayerGridProps {
  board: PlayerBoard;
  isOwn: boolean;
  small?: boolean;
  highlightSpaces?: SpaceNumber[];
  onSpaceClick?: (space: SpaceNumber) => void;
}

export function PlayerGrid({ board, isOwn, small, highlightSpaces, onSpaceClick }: PlayerGridProps) {
  const gap = small ? 'gap-1' : 'gap-1.5';
  const particles = useParticles();
  const cardRefs = useRef<Partial<Record<SpaceNumber, HTMLDivElement | null>>>({});

  const prevBoard = usePrevious(board);
  const [flippingSpaces, setFlippingSpaces] = useState<Set<SpaceNumber>>(new Set());
  const [placingSpaces, setPlacingSpaces] = useState<Set<SpaceNumber>>(new Set());

  useEffect(() => {
    if (!prevBoard) return;
    const newFlipping = new Set<SpaceNumber>();
    const newPlacing = new Set<SpaceNumber>();
    const newValidated = new Set<SpaceNumber>();

    for (let i = 1; i <= 9; i++) {
      const n = i as SpaceNumber;
      const prev = prevBoard[n].state;
      const curr = board[n].state;

      if (prev === 'FACEDOWN_ONLY' && (curr === 'FACEUP_ONLY' || curr === 'VALIDATED')) {
        newFlipping.add(n);
      }
      if (prev === 'EMPTY' && curr === 'FACEDOWN_ONLY') {
        newPlacing.add(n);
      }
      if (prev !== 'VALIDATED' && curr === 'VALIDATED') {
        newValidated.add(n);
      }
    }

    if (newFlipping.size > 0) {
      setFlippingSpaces(newFlipping);
      setTimeout(() => setFlippingSpaces(new Set()), 650);
    }
    if (newPlacing.size > 0) {
      setPlacingSpaces(newPlacing);
      setTimeout(() => setPlacingSpaces(new Set()), 350);
    }
    for (const n of newValidated) {
      const el = cardRefs.current[n];
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        particles.emit('sparkle', centerX, centerY);
      }
    }
  }, [board, prevBoard, particles]);

  return (
    <div className={`grid grid-cols-3 ${gap} justify-items-center`}>
      {SPACE_ORDER.map((spaceNum) => {
        const space = board[spaceNum];
        const isHighlighted = highlightSpaces?.includes(spaceNum) ?? false;
        const canClick = isOwn && isHighlighted && !!onSpaceClick;

        switch (space.state) {
          case 'EMPTY':
            return (
              <Card
                key={spaceNum}
                card={null}
                spaceNumber={spaceNum}
                small={small}
                highlighted={isHighlighted}
                onClick={canClick ? () => onSpaceClick(spaceNum) : undefined}
              />
            );

          case 'FACEDOWN_ONLY':
            return (
              <Card
                key={spaceNum}
                card={null}
                facedown
                small={small}
                placing={placingSpaces.has(spaceNum)}
              />
            );

          case 'FACEUP_ONLY':
            return (
              <div key={spaceNum} ref={(el) => { cardRefs.current[spaceNum] = el; }} className="relative">
                <Card
                  card={space.topCard}
                  small={small}
                  flipping={flippingSpaces.has(spaceNum)}
                />
              </div>
            );

          case 'VALIDATED':
            return (
              <div key={spaceNum} ref={(el) => { cardRefs.current[spaceNum] = el; }} className="relative">
                <Card
                  card={space.topCard}
                  small={small}
                  flipping={flippingSpaces.has(spaceNum)}
                />
                {/* Validated checkmark */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-green)] rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  V
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
