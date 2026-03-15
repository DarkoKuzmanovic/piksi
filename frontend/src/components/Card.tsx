import type { CardType, SpaceNumber } from '../store/game-store';

const COLOR_MAP: Record<string, string> = {
  blue: '#3B82F6',
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
};

interface CardProps {
  card: CardType | null;
  facedown?: boolean;
  selected?: boolean;
  onClick?: () => void;
  small?: boolean;
  spaceNumber?: SpaceNumber;
  highlighted?: boolean;
}

export function Card({ card, facedown, selected, onClick, small, spaceNumber, highlighted }: CardProps) {
  const baseSize = small ? 'w-[4.5rem] h-[5.5rem]' : 'w-[5.5rem] h-[7rem]';
  const baseFontSize = small ? 'text-xl' : 'text-3xl';
  const smallFontSize = small ? 'text-[10px]' : 'text-xs';

  // Empty space
  if (!card && !facedown) {
    return (
      <button
        onClick={onClick}
        disabled={!onClick}
        className={`
          ${baseSize} rounded-lg flex items-center justify-center
          transition-all duration-200 relative
          ${highlighted
            ? 'border-2 border-[var(--color-accent)] animate-pulse-border cursor-pointer hover:scale-105'
            : 'border-2 border-dashed border-[var(--color-text-muted)]/30'
          }
          ${onClick && !highlighted ? 'cursor-pointer hover:border-[var(--color-text-muted)]/60' : ''}
          ${!onClick ? 'cursor-default' : ''}
        `}
      >
        {spaceNumber && (
          <span className={`${baseFontSize} text-[var(--color-text-muted)]/20 font-bold`}>
            {spaceNumber}
          </span>
        )}
      </button>
    );
  }

  // Facedown card
  if (facedown || !card) {
    return (
      <div
        className={`
          ${baseSize} rounded-lg card-back-pattern
          border-2 border-[var(--color-bg-surface)]
          flex items-center justify-center
          transition-all duration-200
        `}
      >
        <span className={`${small ? 'text-lg' : 'text-2xl'} opacity-30`}>?</span>
      </div>
    );
  }

  // Faceup card
  const primaryColor = card.colors[0] ? COLOR_MAP[card.colors[0]] : '#888';
  const isMulticolor = card.multicolor;

  const borderStyle = isMulticolor
    ? 'border-2 border-multicolor'
    : 'border-2';

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        ${baseSize} rounded-lg relative
        ${borderStyle}
        bg-[var(--color-bg-card)]
        flex flex-col items-center justify-between p-1.5
        transition-all duration-200
        ${selected ? 'scale-110 shadow-lg shadow-[var(--color-accent)]/50 ring-2 ring-[var(--color-accent)]' : ''}
        ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
      `}
      style={!isMulticolor ? { borderColor: primaryColor } : undefined}
    >
      {/* Color dots row */}
      <div className="flex gap-0.5 justify-center w-full">
        {card.colors.map((color, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: COLOR_MAP[color] }}
          />
        ))}
      </div>

      {/* Card number (large center) */}
      <span
        className={`${small ? 'text-2xl' : 'text-4xl'} font-bold leading-none`}
        style={{ color: isMulticolor ? '#e0e0e0' : primaryColor }}
      >
        {card.number}
      </span>

      {/* Symbols row */}
      <div className={`flex items-center gap-1 ${smallFontSize}`}>
        {card.spirals > 0 && (
          <span className="text-[var(--color-green)]">
            {'S'.repeat(card.spirals)}
          </span>
        )}
        {card.crosses > 0 && (
          <span className="text-[var(--color-red)]">
            {'X'.repeat(card.crosses)}
          </span>
        )}
        {card.specialSpiralPerFaceupColor && (
          <span
            className="text-[9px] font-bold"
            style={{ color: COLOR_MAP[card.specialSpiralPerFaceupColor] }}
          >
            +S/{card.specialSpiralPerFaceupColor[0].toUpperCase()}
          </span>
        )}
      </div>
    </button>
  );
}
