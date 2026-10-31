import { useEffect, useRef } from "react";
import { useGameStore } from "../store/game-store";
import {
  scoreValidated,
  scoreSymbols,
  scoreLargestZone,
} from "@shared/scoring";
import { trapDialogFocus } from "./dialog-focus";

export function ScoreBreakdown() {
  const { gameState, playerId, playerNames, nextRound, connectionStatus } =
    useGameStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    buttonRef.current?.focus();
  }, []);
  if (!gameState || !playerId) return null;
  const opponentId = gameState.playerIds.find((id) => id !== playerId);
  if (!opponentId) return null;
  const round = gameState.roundNumber;
  const own = gameState.boards[playerId];
  const opponent = gameState.boards[opponentId];
  const rows = [
    {
      label: "Validated",
      detail: "Sum of validated space numbers",
      own: scoreValidated(own),
      opponent: scoreValidated(opponent),
    },
    {
      label: "Symbols",
      detail: "Spirals minus crosses, plus special spirals",
      own: scoreSymbols(own),
      opponent: scoreSymbols(opponent),
    },
    {
      label: "Largest color zone",
      detail: `Connected cards × ${round + 1}`,
      own: scoreLargestZone(own, round),
      opponent: scoreLargestZone(opponent, round),
    },
  ];
  const ownRound = rows.reduce((sum, row) => sum + row.own, 0);
  const opponentRound = rows.reduce((sum, row) => sum + row.opponent, 0);
  const ownTotal = (gameState.scores[playerId] ?? []).reduce(
    (a, b) => a + b,
    0,
  );
  const opponentTotal = (gameState.scores[opponentId] ?? []).reduce(
    (a, b) => a + b,
    0,
  );
  return (
    <div className="modal-backdrop">
      <section
        className="modal-panel score-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="score-title"
        onKeyDown={trapDialogFocus}
      >
        <p className="eyebrow">The magic adds up</p>
        <h2 id="score-title">Round {round} complete</h2>
        <p className="muted">Here's how your woodlands scored.</p>
        <div className="score-table">
          <div className="score-row score-head">
            <span></span>
            <strong>{playerNames[playerId] ?? "You"}</strong>
            <strong>{playerNames[opponentId] ?? "Opponent"}</strong>
          </div>
          {rows.map((row) => (
            <div className="score-row" key={row.label}>
              <span>
                <strong>{row.label}</strong>
                <small>{row.detail}</small>
              </span>
              <b>{row.own}</b>
              <b>{row.opponent}</b>
            </div>
          ))}
          <div className="score-row score-round">
            <span>Round total</span>
            <b>{ownRound}</b>
            <b>{opponentRound}</b>
          </div>
          <div className="score-row score-cumulative">
            <span>Overall total</span>
            <b>{ownTotal}</b>
            <b>{opponentTotal}</b>
          </div>
        </div>
        <button
          ref={buttonRef}
          className="button primary full-width"
          disabled={connectionStatus !== "connected"}
          onClick={nextRound}
        >
          {round === 3 ? "See final results" : "Continue to next round"}
        </button>
      </section>
    </div>
  );
}
