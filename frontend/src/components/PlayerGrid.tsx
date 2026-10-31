import type { PlayerBoard, SpaceNumber } from "../store/game-store";
import { Card } from "./Card";

const spaces: SpaceNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface PlayerGridProps {
  board: PlayerBoard;
  isOwn: boolean;
  highlightSpaces?: SpaceNumber[];
  onSpaceClick?: (space: SpaceNumber) => void;
}

export function PlayerGrid({
  board,
  isOwn,
  highlightSpaces = [],
  onSpaceClick,
}: PlayerGridProps) {
  return (
    <div
      className="player-grid"
      aria-label={isOwn ? "Your grid" : "Opponent's grid"}
    >
      {spaces.map((number) => {
        const space = board[number];
        const highlight = highlightSpaces.includes(number);
        return (
          <div
            className="grid-cell"
            key={`${number}-${space.state}-${space.topCard?.cardTypeId ?? ""}`}
          >
            <Card
              card={space.topCard}
              facedown={space.state === "FACEDOWN_ONLY"}
              spaceNumber={number}
              highlighted={highlight}
              onClick={
                isOwn && highlight && onSpaceClick
                  ? () => onSpaceClick(number)
                  : undefined
              }
            />
            {space.state === "VALIDATED" && (
              <span
                className="validated-badge"
                aria-label="Validated"
                title="Validated"
              >
                ✓
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
