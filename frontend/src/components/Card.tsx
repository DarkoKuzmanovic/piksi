import type { CardType, SpaceNumber } from "../store/game-store";
import { SymbolIcon } from "./SymbolIcon";

const suitColors = ["blue", "green", "yellow", "red"] as const;

interface CardProps {
  card: CardType | null;
  facedown?: boolean;
  onClick?: () => void;
  spaceNumber?: SpaceNumber;
  highlighted?: boolean;
}

export function Card({
  card,
  facedown,
  onClick,
  spaceNumber,
  highlighted,
}: CardProps) {
  const description = card
    ? `${card.multicolor ? "Multicolor" : card.colors.join(" and ")} ${card.number}, ${card.spirals} spirals, ${card.crosses} crosses${card.specialSpiralPerFaceupColor ? `, special spiral for ${card.specialSpiralPerFaceupColor}` : ""}`
    : facedown
      ? "Face-down card"
      : `Empty space ${spaceNumber}`;
  const content =
    card && !facedown ? (
      <>
        <span className="suit-band" aria-hidden="true">
          {(card.multicolor ? suitColors : card.colors).map((color) => (
            <span key={color} className={`suit-pattern pattern-${color}`} />
          ))}
        </span>
        <span className="card-number">{card.number}</span>
        <img
          className="card-art"
          src={`/assets/cards/animal-${card.number}.webp`}
          alt=""
          draggable={false}
        />
        <span className="card-symbols" aria-hidden="true">
          {card.spirals > 0 && <span><SymbolIcon kind="spiral" />{card.spirals}</span>}
          {card.crosses > 0 && <span><SymbolIcon kind="cross" />{card.crosses}</span>}
          {card.specialSpiralPerFaceupColor && (
            <span className={`special-${card.specialSpiralPerFaceupColor}`}>
              <SymbolIcon kind="special" />
            </span>
          )}
        </span>
        <span className="card-suit" aria-hidden="true">
          {card.multicolor ? "ALL" : card.colors[0]}
        </span>
      </>
    ) : !facedown ? (
      <span className="empty-number">{spaceNumber}</span>
    ) : null;
  const classes = `card ${card && !facedown ? `card-face suit-${card.multicolor ? "multi" : card.colors[0]}` : facedown ? "card-back" : "card-empty"} ${highlighted ? "card-highlight" : ""} ${onClick ? "card-action" : ""}`;
  return onClick ? (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={description}
    >
      {content}
    </button>
  ) : (
    <div className={classes} role="img" aria-label={description}>
      {content}
    </div>
  );
}
