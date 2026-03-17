import { useState, useEffect } from 'react';
import type { CardType } from '../store/game-store';
import { usePrevious } from '../hooks/use-previous';
import { Card } from './Card';

interface DisplayProps {
  cards: CardType[];
  canPick: boolean;
  onPick: (cardTypeId: string) => void;
}

export function Display({ cards, canPick, onPick }: DisplayProps) {
  const [entering, setEntering] = useState(false);
  const prevFirstCardId = usePrevious(cards[0]?.cardTypeId);

  useEffect(() => {
    if (cards.length > 0 && prevFirstCardId !== undefined && cards[0].cardTypeId !== prevFirstCardId) {
      setEntering(true);
      const timer = setTimeout(() => setEntering(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cards, prevFirstCardId]);

  if (cards.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 px-2">
      {cards.map((card, index) => (
        <div
          key={card.cardTypeId}
          className={`transition-all duration-200 ${!canPick ? 'opacity-50' : ''} ${entering ? 'animate-card-enter' : ''}`}
          style={entering ? { animationDelay: `${index * 80}ms` } : undefined}
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
