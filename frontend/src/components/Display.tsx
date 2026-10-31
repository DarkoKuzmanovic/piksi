import type { CardType } from "../store/game-store";
import { Card } from "./Card";

interface DisplayProps {
  cards: CardType[];
  canPick: boolean;
  onPick: (cardTypeId: string) => void;
}

export function Display({ cards, canPick, onPick }: DisplayProps) {
  return (
    <div className="display-cards" aria-label="Cards in the shared display">
      {cards.map((card) => (
        <Card
          key={card.cardTypeId}
          card={card}
          onClick={canPick ? () => onPick(card.cardTypeId) : undefined}
        />
      ))}
      {cards.length === 0 && (
        <span className="muted">No cards in the display</span>
      )}
    </div>
  );
}
