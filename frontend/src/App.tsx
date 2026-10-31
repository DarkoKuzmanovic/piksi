import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "./store/game-store";
import { Lobby } from "./components/Lobby";
import { GameBoard } from "./components/GameBoard";
import { ScoreBreakdown } from "./components/ScoreBreakdown";
import { GameOver } from "./components/GameOver";
import { Rules } from "./components/Rules";

export default function App() {
  const {
    connect,
    roomCode,
    lobbyState,
    gameState,
    errorMessage,
    connectionStatus,
  } = useGameStore();
  const [showRules, setShowRules] = useState(false);
  const closeRules = useCallback(() => setShowRules(false), []);
  useEffect(() => {
    connect();
  }, [connect]);
  let content;
  if (!gameState || (!roomCode && lobbyState !== "ready")) content = <Lobby />;
  else if (gameState.phase === "game_over") content = <GameOver />;
  else
    content = (
      <>
        <GameBoard />
        {gameState.phase === "round_scoring" && <ScoreBreakdown />}
      </>
    );
  return (
    <>
      <div className="app-tools">
        <span
          className={`connection connection-${connectionStatus}`}
          role="status"
        >
          <span className="connection-dot" />
          {connectionStatus === "connected"
            ? "Connected"
            : connectionStatus === "connecting"
              ? "Connecting…"
              : "Disconnected"}
        </span>
        <button className="rules-button" onClick={() => setShowRules(true)}>
          How to play
        </button>
      </div>
      {errorMessage && (
        <div className="error-toast" role="alert">
          {errorMessage}
        </div>
      )}
      {content}
      {showRules && <Rules onClose={closeRules} />}
    </>
  );
}
