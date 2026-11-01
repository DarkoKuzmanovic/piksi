import { useGameStore } from "../store/game-store";

export function GameOver() {
  const { gameState, playerId, playerNames, playAgain, connectionStatus, rematchPlayerIds } =
    useGameStore();
  if (!gameState || !playerId) return null;
  const opponentId = gameState.playerIds.find((id) => id !== playerId);
  if (!opponentId) return null;
  const own = gameState.scores[playerId] ?? [];
  const opponent = gameState.scores[opponentId] ?? [];
  const ownTotal = own.reduce((a, b) => a + b, 0);
  const opponentTotal = opponent.reduce((a, b) => a + b, 0);
  const opponentName = playerNames[opponentId] ?? "Your friend";
  const requested = rematchPlayerIds.includes(playerId);
  const opponentRequested = rematchPlayerIds.includes(opponentId);
  const title =
    ownTotal > opponentTotal
      ? "You won!"
      : ownTotal < opponentTotal
        ? `${playerNames[opponentId] ?? "Your friend"} won!`
        : "It's a tie!";
  return (
    <main className="end-shell">
      <img src="/assets/brand/logo.webp" alt="" className="end-emblem" />
      <section className="wood-panel end-panel">
        <header className="panel-heading">
          <p className="eyebrow">The final chapter</p>
          <h1>{title}</h1>
        </header>
        <p className="muted">
          Three rounds of woodland magic, beautifully played.
        </p>
        <div className="final-table">
          <div className="final-row final-head">
            <span>Player</span>
            <span>R1</span>
            <span>R2</span>
            <span>R3</span>
            <span>Total</span>
          </div>
          <div className="final-row">
            <strong>{playerNames[playerId] ?? "You"}</strong>
            {[0, 1, 2].map((n) => (
              <span key={n}>{own[n] ?? "–"}</span>
            ))}
            <b>{ownTotal}</b>
          </div>
          <div className="final-row">
            <strong>{playerNames[opponentId] ?? "Opponent"}</strong>
            {[0, 1, 2].map((n) => (
              <span key={n}>{opponent[n] ?? "–"}</span>
            ))}
            <b>{opponentTotal}</b>
          </div>
        </div>
        <p className="rematch-status muted" role="status" aria-live="polite">
          {requested
            ? `Waiting for ${opponentName}…`
            : opponentRequested
              ? `${opponentName} wants a rematch — Play again?`
              : "Ready for another game?"}
        </p>
        <button
          className="button primary full-width"
          disabled={connectionStatus !== "connected" || requested}
          onClick={playAgain}
        >
          {requested ? "Rematch requested" : "Play again"}
        </button>
      </section>
    </main>
  );
}
