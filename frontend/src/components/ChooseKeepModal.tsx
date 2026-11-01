import { useEffect, useRef } from "react";
import type { CardType } from "../store/game-store";
import { Card } from "./Card";
import { trapDialogFocus } from "./dialog-focus";

interface ChooseKeepModalProps {
  existingCard: CardType;
  pendingCard: CardType;
  onChoose: (keepNew: boolean) => void;
}

export function ChooseKeepModal({
  existingCard,
  pendingCard,
  onChoose,
}: ChooseKeepModalProps) {
  const firstButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    firstButton.current?.focus();
  }, []);
  return (
    <div className="modal-backdrop">
      <section
        className="modal-panel keep-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keep-title"
        aria-describedby="keep-description"
        onKeyDown={trapDialogFocus}
      >
        <header className="panel-heading">
          <p className="eyebrow">A matching animal</p>
          <h2 id="keep-title">Choose a card to keep</h2>
        </header>
        <p id="keep-description" className="muted">
          Your space will be validated. The other card goes face down
          underneath.
        </p>
        <div className="keep-options">
          <div>
            <span className="option-label">On your board</span>
            <Card card={existingCard} />
            <button
              ref={firstButton}
              className="button secondary"
              onClick={() => onChoose(false)}
            >
              Keep existing
            </button>
          </div>
          <div>
            <span className="option-label">Just picked</span>
            <Card card={pendingCard} />
            <button className="button primary" onClick={() => onChoose(true)}>
              Keep new
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
