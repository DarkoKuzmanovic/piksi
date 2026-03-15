import type { PlayerBoard, SpaceNumber } from '../store/game-store';
import { Card } from './Card';

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
              />
            );

          case 'FACEUP_ONLY':
            return (
              <div key={spaceNum} className="relative">
                <Card
                  card={space.topCard}
                  small={small}
                />
              </div>
            );

          case 'VALIDATED':
            return (
              <div key={spaceNum} className="relative">
                <Card
                  card={space.topCard}
                  small={small}
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
