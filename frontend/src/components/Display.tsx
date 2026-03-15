import type { CardType } from '../store/game-store';
import { Card } from './Card';

interface DisplayProps {
  cards: CardType[];
  canPick: boolean;
  onPick: (cardTypeId: string) => void;
}

export function Display({ cards, canPick, onPick }: DisplayProps) {
  if (cards.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 px-2">
      {cards.map((card) => (
        <div
          key={card.cardTypeId}
          className={`transition-all duration-200 ${!canPick ? 'opacity-50' : ''}`}
        >
          <Card
            card={card}
            onClick={canPick ? () => onPick(card.cardTypeId) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
