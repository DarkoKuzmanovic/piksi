import { useEffect, useRef } from "react";
import { trapDialogFocus } from "./dialog-focus";
import { SymbolIcon } from "./SymbolIcon";

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
        <p className="eyebrow">A little field guide</p>
        <h2 id="rules-title">How to play</h2>
        <div className="rules-copy">
          <h3>Gather your pixies</h3>
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
