import { create } from "zustand";
import type { ServerMessage } from "@shared/protocol";

type SpaceNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Color = "blue" | "green" | "yellow" | "red";
type GamePhase =
  | "lobby"
  | "choose_card"
  | "choose_keep"
  | "choose_space"
  | "round_scoring"
  | "game_over";
type SpaceState = "EMPTY" | "FACEDOWN_ONLY" | "FACEUP_ONLY" | "VALIDATED";
export interface CardType {
  cardTypeId: string;
  number: SpaceNumber;
  colors: Color[];
  multicolor: boolean;
  spirals: number;
  crosses: number;
  specialSpiralPerFaceupColor: Color | null;
}
export interface Space {
  state: SpaceState;
  topCard: CardType | null;
  bottomCard: CardType | null;
}
export type PlayerBoard = Record<SpaceNumber, Space>;
export interface ClientGameState {
  roundNumber: 1 | 2 | 3;
  turnNumber: number;
  pickIndex: 0 | 1 | 2 | 3;
  activePlayerId: string;
  phase: GamePhase;
  display: CardType[];
  boards: Record<string, PlayerBoard>;
  scores: Record<string, number[]>;
  playerIds: [string, string];
  pendingCard: CardType | null;
  lastTurnTriggered: boolean;
}
export type ConnectionStatus = "disconnected" | "connecting" | "connected";
type LobbyState = "idle" | "creating" | "waiting" | "joining" | "ready";
export type { SpaceNumber, Color, GamePhase, SpaceState };
interface GameStore {
  ws: WebSocket | null;
  connectionStatus: ConnectionStatus;
  lobbyState: LobbyState;
  roomCode: string | null;
  playerId: string | null;
  playerNames: Record<string, string>;
  errorMessage: string | null;
  gameState: ClientGameState | null;
  disconnectedPlayerIds: string[];
  rematchPlayerIds: string[];
  connect: () => void;
  disconnect: () => void;
  createRoom: (playerName: string) => void;
  joinRoom: (roomCode: string, playerName: string) => void;
  chooseCard: (id: string) => void;
  chooseKeep: (keepNew: boolean) => void;
  chooseSpace: (space: SpaceNumber) => void;
  nextRound: () => void;
  playAgain: () => void;
  clearError: () => void;
}
const TOKEN_KEY = "piksi-resume-token";
export const useGameStore = create<GameStore>((set, get) => {
  let reconnectTimer: number | undefined;
  let errorTimer: number | undefined;
  let deliberateClose = false;
  let pendingName = "";
  function send(message: object) {
    const { ws, connectionStatus } = get();
    if (ws && connectionStatus === "connected")
      ws.send(JSON.stringify(message));
  }
  function showError(message: string) {
    window.clearTimeout(errorTimer);
    set({ errorMessage: message });
    errorTimer = window.setTimeout(() => set({ errorMessage: null }), 5000);
  }
  function connect() {
    const current = get().ws;
    if (
      current &&
      (current.readyState === WebSocket.OPEN ||
        current.readyState === WebSocket.CONNECTING)
    )
      return;
    deliberateClose = false;
    set({ connectionStatus: "connecting" });
    const ws = new WebSocket(
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`,
    );
    set({ ws });
    ws.onopen = () => {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token)
        ws.send(JSON.stringify({ type: "resume_session", resumeToken: token }));
      else set({ connectionStatus: "connected" });
    };
    ws.onmessage = (event) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(event.data as string) as ServerMessage;
      } catch {
        return;
      }
      switch (msg.type) {
        case "room_created":
          sessionStorage.setItem(TOKEN_KEY, msg.resumeToken);
          set({
            roomCode: msg.roomCode,
            playerId: msg.playerId,
            playerNames: { [msg.playerId]: pendingName },
            lobbyState: "waiting",
          });
          break;
        case "room_joined":
          sessionStorage.setItem(TOKEN_KEY, msg.resumeToken);
          set({
            roomCode: msg.roomCode,
            playerId: msg.playerId,
            playerNames: msg.playerNames,
            lobbyState: "ready",
          });
          break;
        case "session_resumed":
          set({
            roomCode: msg.roomCode,
            playerId: msg.playerId,
            playerNames: msg.playerNames,
            disconnectedPlayerIds: msg.disconnectedPlayerIds,
            rematchPlayerIds: msg.rematchPlayerIds,
            lobbyState:
              Object.keys(msg.playerNames).length === 2 ? "ready" : "waiting",
            connectionStatus: "connected",
          });
          break;
        case "resume_rejected":
        case "room_abandoned":
          sessionStorage.removeItem(TOKEN_KEY);
          set({
            roomCode: null,
            playerId: null,
            playerNames: {},
            gameState: null,
            lobbyState: "idle",
            rematchPlayerIds: [],
            disconnectedPlayerIds: [],
            connectionStatus: "connected",
          });
          showError(msg.message);
          break;
        case "player_joined":
          set((state) => ({
            lobbyState: "ready",
            playerNames: {
              ...state.playerNames,
              [msg.playerId]: msg.playerName,
            },
          }));
          break;
        case "rematch_status":
          set({ rematchPlayerIds: msg.playerIds });
          break;
        case "game_started":
          set({ rematchPlayerIds: [] });
          break;
        case "game_state":
          set({ gameState: msg.state });
          break;
        case "player_connection":
          set((state) => ({
            disconnectedPlayerIds: msg.connected
              ? state.disconnectedPlayerIds.filter((id) => id !== msg.playerId)
              : [...new Set([...state.disconnectedPlayerIds, msg.playerId])],
          }));
          break;
        case "error":
          set((state) => ({
            lobbyState:
              state.lobbyState === "creating" || state.lobbyState === "joining"
                ? "idle"
                : state.lobbyState,
          }));
          showError(msg.message);
          break;
      }
    };
    ws.onclose = () => {
      if (get().ws !== ws) return;
      set({ ws: null, connectionStatus: "disconnected" });
      if (!deliberateClose) reconnectTimer = window.setTimeout(connect, 2000);
    };
  }
  return {
    ws: null,
    connectionStatus: "disconnected",
    lobbyState: "idle",
    roomCode: null,
    playerId: null,
    playerNames: {},
    errorMessage: null,
    gameState: null,
    disconnectedPlayerIds: [],
    rematchPlayerIds: [],
    connect,
    disconnect: () => {
      deliberateClose = true;
      window.clearTimeout(reconnectTimer);
      sessionStorage.removeItem(TOKEN_KEY);
      get().ws?.close();
      set({
        ws: null,
        connectionStatus: "disconnected",
        lobbyState: "idle",
        roomCode: null,
        playerId: null,
        playerNames: {},
        gameState: null,
        disconnectedPlayerIds: [],
        rematchPlayerIds: [],
      });
    },
    createRoom: (playerName) => {
      pendingName = playerName;
      set({ lobbyState: "creating" });
      send({ type: "create_room", playerName });
    },
    joinRoom: (roomCode, playerName) => {
      set({ lobbyState: "joining" });
      send({ type: "join_room", roomCode, playerName });
    },
    chooseCard: (cardTypeId) => send({ type: "choose_card", cardTypeId }),
    chooseKeep: (keepNew) => send({ type: "choose_keep", keepNew }),
    chooseSpace: (targetSpace) => send({ type: "choose_space", targetSpace }),
    nextRound: () => send({ type: "next_round" }),
    playAgain: () => send({ type: "play_again" }),
    clearError: () => set({ errorMessage: null }),
  };
});
