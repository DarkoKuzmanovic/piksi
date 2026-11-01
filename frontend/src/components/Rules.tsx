import { useEffect, useRef } from "react";
import { trapDialogFocus } from "./dialog-focus";
import { SymbolIcon } from "./SymbolIcon";
import { Card } from "./Card";
import { DECK } from "@shared/deck";

const suitColors = ["blue", "green", "yellow", "red"] as const;
const suitKeys = [...suitColors, "multi"] as const;
const blueSpecialCard = DECK.find((card) => card.cardTypeId === "B6")!;

export function Rules({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("keydown", escape);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal-panel rules-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-title"
        onKeyDown={trapDialogFocus}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="close-button"
          onClick={onClose}
          aria-label="Close rules"
        >
          ×
        </button>
        <header className="panel-heading">
          <p className="eyebrow">A little field guide</p>
          <h2 id="rules-title">How to play</h2>
        </header>
        <div className="rules-copy">
          <h3>Gather your woodland friends</h3>
          <p>
            Over three rounds, take turns choosing cards from the shared
            display. Each card belongs in the matching numbered space of your 3
            × 3 grid.
          </p>
          <h3>Make a match</h3>
          <p>
            A second card in a face-up space validates it: choose which stays
            face up and tuck the other underneath. If that number is already
            validated, place the new card face down in any empty space. A
            matching card later validates it.
          </p>
          <h3>Count your magic</h3>
          <p>
            Validated spaces score their number. Face-up spirals add points and
            crosses subtract points. A special spiral scores one point for each
            face-up card of its color (including itself). Multicolor cards count
            as every color.
          </p>
          <h3>Card symbol legend</h3>
          <ul className="symbol-legend">
            <li><SymbolIcon kind="spiral" /><span><strong>Spiral</strong> · +1 point per spiral</span></li>
            <li><SymbolIcon kind="cross" /><span><strong>Cross</strong> · −1 point per cross</span></li>
            <li><span className="legend-special"><SymbolIcon kind="special" /></span><span><strong>Special spiral</strong> · +1 per face-up card of its color, including itself</span></li>
          </ul>
          <h3>Card colors &amp; pattern bands</h3>
          <div className="suit-key">
            {suitKeys.map((suit) => (
              <div key={suit}>
                <span className="suit-band" aria-hidden="true">
                  {(suit === "multi" ? suitColors : [suit]).map((color) => (
                    <span key={color} className={`suit-pattern pattern-${color}`} />
                  ))}
                </span>
                {suit === "multi" ? "ALL" : suit.toUpperCase()}
              </div>
            ))}
          </div>
          <div className="special-example">
            <Card card={blueSpecialCard} />
            <p>Special spiral matches the card’s printed color below it (e.g. BLUE special spiral counts every face-up BLUE &amp; ALL card).</p>
          </div>
          <h3>Grow a color zone</h3>
          <p>
            Your largest orthogonally connected group of at least two matching
            colors scores its size × 2, 3 or 4 in rounds 1, 2 or 3 respectively.
            Diagonals do not connect. The most points after three rounds wins.
          </p>
          <h3>The final turn</h3>
          <p>
            When a player fills all nine spaces, the round ends. If necessary,
            the other player gets one final pick so both have played equally.
          </p>
        </div>
        <button className="button primary" onClick={onClose}>
          Back to game
        </button>
      </section>
    </div>
  );
}
