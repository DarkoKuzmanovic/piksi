import { scoreRound } from "@shared/scoring";
import { useGameStore } from "../store/game-store";
import type { SpaceNumber } from "../store/game-store";
import { PlayerGrid } from "./PlayerGrid";
import { Display } from "./Display";
import { ChooseKeepModal } from "./ChooseKeepModal";
import { Card } from "./Card";

export function GameBoard() {
  const {
    gameState,
    playerId,
    playerNames,
    connectionStatus,
    disconnectedPlayerIds,
    chooseCard,
    chooseKeep,
    chooseSpace,
  } = useGameStore();
  if (!gameState || !playerId) return null;
  const opponentId = gameState.playerIds.find((id) => id !== playerId);
  if (!opponentId) return null;
  const own = gameState.boards[playerId];
  const opponent = gameState.boards[opponentId];
  const myTurn = gameState.activePlayerId === playerId;
  const connected = connectionStatus === "connected";
  const phase = gameState.phase;
  const opponentName = playerNames[opponentId] ?? "Opponent";
  const myName = playerNames[playerId] ?? "You";
  const targets =
    phase === "choose_space" && myTurn && connected
      ? ([1, 2, 3, 4, 5, 6, 7, 8, 9] as SpaceNumber[]).filter(
          (n) => own[n].state === "EMPTY",
        )
      : [];
  let guidance =
    phase === "round_scoring"
      ? "Round complete"
      : myTurn
        ? "Choose a card from the display"
        : `${opponentName} is choosing a card`;
  if (phase === "choose_keep")
    guidance = myTurn
      ? "Choose which card stays face up"
      : `${opponentName} is choosing a card to keep`;
  if (phase === "choose_space")
    guidance = myTurn
      ? "Choose a highlighted empty space"
      : `${opponentName} is placing a card face down`;
  if (!connected) guidance = "Connection lost — reconnecting…";
  if (connected && disconnectedPlayerIds.includes(opponentId))
    guidance = `${opponentName} is reconnecting…`;
  const existing =
    gameState.pendingCard && own[gameState.pendingCard.number].topCard;
  const total = (id: string) =>
    (gameState.scores[id] ?? []).reduce((a, b) => a + b, 0);
  return (
    <main className="game-shell">
      <header className="game-header">
        <span className="mini-brand">PIKSI</span>
        <span className="game-metadata">
          Round <span className="numeral">{gameState.roundNumber}</span> / <span className="numeral">3</span>{" "}
          <span className="header-separator">·</span> Turn{" "}
          <span className="numeral">{gameState.turnNumber}</span> <span className="header-separator">·</span>{" "}
          Pick <span className="numeral">{gameState.pickIndex + 1}</span> / <span className="numeral">4</span>
        </span>
        <span className="header-spacer" />
      </header>
      <div
        className={`turn-banner ${myTurn && connected ? "your-turn" : ""}`}
        role="status"
        aria-live="polite"
      >
        <span className="turn-dot" />
        <div>
          <strong>{guidance}</strong>
          {gameState.lastTurnTriggered && (
            <span className="last-turn"> · Final pick</span>
          )}
        </div>
      </div>
      <div className="game-layout">
        <section
          className="board-panel opponent-panel"
          aria-label={`${opponentName}'s board`}
        >
          <div className="board-heading">
            <div>
              <span className="eyebrow">Their woodland</span>
              <h2>{opponentName}</h2>
            </div>
            <div className="preview">
              Round preview{" "}
              <strong><span className="numeral">{scoreRound(opponent, gameState.roundNumber)}</span> <span className="points-label">pts</span></strong>
            </div>
            <div className="score-pill">
              <strong>{total(opponentId)}</strong>
              <span>total</span>
            </div>
          </div>
          <PlayerGrid board={opponent} isOwn={false} />
        </section>
        <section className="display-panel" aria-label="Shared display">
          <div className="display-heading">
            <div>
              <span className="eyebrow">The gathering</span>
              <h2>Choose an animal</h2>
            </div>
            <span className="display-hint">
              {!myTurn
                ? "Waiting for your turn"
                : phase === "choose_card" && connected
                  ? "Choose one"
                  : phase === "choose_space"
                    ? "Place your card"
                    : "Resolve your match"}
            </span>
          </div>
          {phase === "choose_space" && myTurn && gameState.pendingCard ? (
            <div className="pending-note">
              <Card card={gameState.pendingCard} />
              <span>
                Your {gameState.pendingCard.number} is already validated. Place
                this card face down in a highlighted empty space.
              </span>
            </div>
          ) : (
            <Display
              cards={gameState.display}
              canPick={myTurn && phase === "choose_card" && connected}
              onPick={chooseCard}
            />
          )}
        </section>
        <section className="board-panel own-panel" aria-label="Your board">
          <div className="board-heading">
            <div>
              <span className="eyebrow">Your woodland</span>
              <h2>
                {myName} <span className="you-label">· you</span>
              </h2>
            </div>
            <div className="preview">
              Round preview{" "}
              <strong><span className="numeral">{scoreRound(own, gameState.roundNumber)}</span> <span className="points-label">pts</span></strong>
            </div>
            <div className="score-pill">
              <strong>{total(playerId)}</strong>
              <span>total</span>
            </div>
          </div>
          <PlayerGrid
            board={own}
            isOwn
            highlightSpaces={targets}
            onSpaceClick={chooseSpace}
          />
        </section>
      </div>
      {phase === "choose_keep" &&
        myTurn &&
        connected &&
        gameState.pendingCard &&
        existing && (
          <ChooseKeepModal
            existingCard={existing}
            pendingCard={gameState.pendingCard}
            onChoose={chooseKeep}
          />
        )}
    </main>
  );
}
