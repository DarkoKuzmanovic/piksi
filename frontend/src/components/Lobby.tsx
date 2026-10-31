import { useEffect, useState } from "react";
import { useGameStore } from "../store/game-store";

export function Lobby() {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("piksi-player-name") || "",
  );
  const [roomCodeInput, setRoomCodeInput] = useState(
    () =>
      new URLSearchParams(window.location.search)
        .get("room")
        ?.toUpperCase()
        .slice(0, 4) ?? "",
  );
  const [copied, setCopied] = useState(false);
  const {
    createRoom,
    joinRoom,
    lobbyState,
    roomCode,
    clearError,
    connectionStatus,
  } = useGameStore();
  useEffect(() => {
    if (playerName) localStorage.setItem("piksi-player-name", playerName);
  }, [playerName]);
  const waiting = lobbyState === "waiting" && roomCode;
  const ready = connectionStatus === "connected";
  async function copyInvite() {
    const link = new URL(window.location.origin + window.location.pathname);
    link.searchParams.set("room", roomCode!);
    try {
      await navigator.clipboard.writeText(link.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }
  return (
    <main className="lobby-shell">
      <div className="lobby-brand">
        <img src="/assets/brand/logo.webp" alt="" className="brand-emblem" />
        <h1 className="wordmark">PIKSI</h1>
        <p>A little magic for two</p>
      </div>
      <section className="lobby-panel glass-panel">
        {waiting ? (
          <>
            <p className="eyebrow">Your invitation is ready</p>
            <h2>Waiting for a friend</h2>
            <p className="muted">
              Share your invitation link or room code. The game begins when your
              friend joins.
            </p>
            <div className="room-code">
              <span>ROOM CODE</span>
              <strong>{roomCode}</strong>
            </div>
            <button className="button primary full-width" onClick={copyInvite}>
              {copied ? "Invite link copied" : "Copy invite link"}
            </button>
            <p className="waiting-indicator">
              <span className="turn-dot" /> Waiting for your friend to join
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">Welcome to the woodland</p>
            <h2>Gather your pixies</h2>
            <p className="muted">
              Create a game or join a friend for a little friendly magic.
            </p>
            <label htmlFor="player-name">Your name</label>
            <input
              id="player-name"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              maxLength={16}
              placeholder="What should we call you?"
              autoComplete="nickname"
            />
            <button
              className="button primary full-width"
              disabled={
                !playerName.trim() || !ready || lobbyState === "creating"
              }
              onClick={() => {
                clearError();
                createRoom(playerName.trim());
              }}
            >
              {lobbyState === "creating" ? "Creating game…" : "Create a game"}
            </button>
            <div className="divider">
              <span>or join a friend</span>
            </div>
            <label htmlFor="room-code">Room code</label>
            <div className="join-row">
              <input
                id="room-code"
                value={roomCodeInput}
                onChange={(event) =>
                  setRoomCodeInput(event.target.value.toUpperCase().slice(0, 4))
                }
                maxLength={4}
                placeholder="ABCD"
                autoCapitalize="characters"
              />
              <button
                className="button secondary"
                disabled={
                  !playerName.trim() ||
                  roomCodeInput.length !== 4 ||
                  !ready ||
                  lobbyState === "joining"
                }
                onClick={() => {
                  clearError();
                  joinRoom(roomCodeInput, playerName.trim());
                }}
              >
                {lobbyState === "joining" ? "Joining…" : "Join game"}
              </button>
            </div>
          </>
        )}
      </section>
      <p className="lobby-footer">
        A cozy card game for two · Three rounds of magic
      </p>
    </main>
  );
}
