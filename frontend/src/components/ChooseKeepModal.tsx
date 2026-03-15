import type { CardType } from '../store/game-store';
import { Card } from './Card';

interface ChooseKeepModalProps {
  existingCard: CardType;
  pendingCard: CardType;
  onChoose: (keepNew: boolean) => void;
}

export function ChooseKeepModal({ existingCard, pendingCard, onChoose }: ChooseKeepModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
      <div className="bg-[var(--color-bg)] border-2 border-[var(--color-accent)] rounded-xl p-6 max-w-sm w-full mx-4 animate-slide-up">
        <h2 className="text-xl font-bold text-center text-[var(--color-accent)] mb-1">
          CHOOSE FACEUP CARD
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] text-center mb-5">
          Which card stays faceup? The other goes facedown.
        </p>

        <div className="flex items-start justify-center gap-6">
          {/* Existing card */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">EXISTING</span>
            <Card card={existingCard} />
            <button
              onClick={() => onChoose(false)}
              className="
                px-4 py-2 bg-[var(--color-bg-surface)] border-2 border-[var(--color-blue)]
                text-[var(--color-blue)] font-bold rounded-lg text-sm
                hover:bg-[var(--color-blue)] hover:text-white
                transition-all duration-200 active:scale-95
                min-w-[5rem] min-h-[44px]
              "
            >
              KEEP
            </button>
          </div>

          {/* Pending card */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">NEW</span>
            <Card card={pendingCard} />
            <button
              onClick={() => onChoose(true)}
              className="
                px-4 py-2 bg-[var(--color-bg-surface)] border-2 border-[var(--color-accent)]
                text-[var(--color-accent)] font-bold rounded-lg text-sm
                hover:bg-[var(--color-accent)] hover:text-white
                transition-all duration-200 active:scale-95
                min-w-[5rem] min-h-[44px]
              "
            >
              KEEP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
