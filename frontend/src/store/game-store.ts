import { create } from 'zustand';

// Inline the types we need (don't import from backend protocol)
type SpaceNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Color = 'blue' | 'green' | 'yellow' | 'red';
type GamePhase = 'lobby' | 'choose_card' | 'choose_keep' | 'choose_space' | 'round_scoring' | 'game_over';
type SpaceState = 'EMPTY' | 'FACEDOWN_ONLY' | 'FACEUP_ONLY' | 'VALIDATED';

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

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
export type LobbyState = 'idle' | 'creating' | 'waiting' | 'joining' | 'ready';

export { type SpaceNumber, type Color, type GamePhase, type SpaceState };

interface GameStore {
  // Connection
  ws: WebSocket | null;
  connectionStatus: ConnectionStatus;

  // Lobby
  lobbyState: LobbyState;
  roomCode: string | null;
  playerId: string | null;
  playerNames: Record<string, string>;
  errorMessage: string | null;
  _pendingOpponentName: string | null;

  // Game
  gameState: ClientGameState | null;

  // Computed helpers
  isMyTurn: () => boolean;
  myBoard: () => PlayerBoard | null;
  opponentBoard: () => PlayerBoard | null;
  opponentId: () => string | null;

  // Actions
  connect: () => void;
  disconnect: () => void;
  createRoom: (playerName: string) => void;
  joinRoom: (roomCode: string, playerName: string) => void;
  chooseCard: (cardTypeId: string) => void;
  chooseKeep: (keepNew: boolean) => void;
  chooseSpace: (targetSpace: SpaceNumber) => void;
  nextRound: () => void;
  playAgain: () => void;
  clearError: () => void;
}

function getWsUrl(): string {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${proto}://${window.location.host}/ws`;
}

export const useGameStore = create<GameStore>((set, get) => {
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let errorTimeout: ReturnType<typeof setTimeout> | null = null;

  function send(msg: Record<string, unknown>) {
    const { ws, connectionStatus } = get();
    if (ws && connectionStatus === 'connected') {
      ws.send(JSON.stringify(msg));
    }
  }

  function handleMessage(data: string) {
    try {
      const msg = JSON.parse(data);
      switch (msg.type) {
        case 'room_created':
          set({
            roomCode: msg.roomCode,
            playerId: msg.playerId,
            lobbyState: 'waiting',
          });
          break;

        case 'room_joined':
          set((state) => ({
            playerId: msg.playerId,
            playerNames: { ...state.playerNames, ...msg.playerNames },
            lobbyState: 'ready',
          }));
          break;

        case 'player_joined':
          set({
            lobbyState: 'ready',
            _pendingOpponentName: msg.playerName as string,
          });
          break;

        case 'game_started':
          // Game is starting, we'll get game_state next
          break;

        case 'game_state':
          set((state) => {
            const gs = msg.state as ClientGameState;
            const updatedNames = { ...state.playerNames };
            // If we have a pending opponent name, assign it to the other player ID
            const pendingName = state._pendingOpponentName;
            if (pendingName && state.playerId) {
              const opId = gs.playerIds.find((id: string) => id !== state.playerId);
              if (opId && !updatedNames[opId]) {
                updatedNames[opId] = pendingName;
              }
            }
            return {
              gameState: gs,
              playerNames: updatedNames,
            };
          });
          break;

        case 'error':
          set({ errorMessage: msg.message });
          // Auto-dismiss after 3 seconds
          if (errorTimeout) clearTimeout(errorTimeout);
          errorTimeout = setTimeout(() => {
            set({ errorMessage: null });
          }, 3000);
          break;
      }
    } catch {
      // Ignore malformed messages
    }
  }

  function connectWs() {
    const existing = get().ws;
    if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) {
      return;
    }

    set({ connectionStatus: 'connecting' });

    const ws = new WebSocket(getWsUrl());

    ws.onopen = () => {
      set({ connectionStatus: 'connected', ws });
    };

    ws.onmessage = (event) => {
      handleMessage(event.data as string);
    };

    ws.onclose = () => {
      set({
        connectionStatus: 'disconnected',
        ws: null,
      });
      // Auto-reconnect after 2 seconds if we were in a game
      const state = get();
      if (state.roomCode) {
        reconnectTimeout = setTimeout(() => {
          connectWs();
        }, 2000);
      }
    };

    ws.onerror = () => {
      // onclose will fire after this
    };

    set({ ws });
  }

  return {
    // Initial state
    ws: null,
    connectionStatus: 'disconnected',
    lobbyState: 'idle',
    roomCode: null,
    playerId: null,
    playerNames: {},
    errorMessage: null,
    _pendingOpponentName: null,
    gameState: null,

    // Computed helpers
    isMyTurn: () => {
      const { gameState, playerId } = get();
      if (!gameState || !playerId) return false;
      return gameState.activePlayerId === playerId;
    },

    myBoard: () => {
      const { gameState, playerId } = get();
      if (!gameState || !playerId) return null;
      return gameState.boards[playerId] ?? null;
    },

    opponentBoard: () => {
      const { gameState, playerId } = get();
      if (!gameState || !playerId) return null;
      const opId = gameState.playerIds.find(id => id !== playerId);
      if (!opId) return null;
      return gameState.boards[opId] ?? null;
    },

    opponentId: () => {
      const { gameState, playerId } = get();
      if (!gameState || !playerId) return null;
      return gameState.playerIds.find(id => id !== playerId) ?? null;
    },

    // Actions
    connect: () => {
      connectWs();
    },

    disconnect: () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      const { ws } = get();
      if (ws) {
        ws.close();
      }
      set({
        ws: null,
        connectionStatus: 'disconnected',
        lobbyState: 'idle',
        roomCode: null,
        playerId: null,
        playerNames: {},
        gameState: null,
        errorMessage: null,
        _pendingOpponentName: null,
      });
    },

    createRoom: (playerName: string) => {
      const state = get();
      if (state.connectionStatus !== 'connected') {
        connectWs();
        // Wait for connection then send
        const checkInterval = setInterval(() => {
          const s = get();
          if (s.connectionStatus === 'connected') {
            clearInterval(checkInterval);
            set({ lobbyState: 'creating', playerNames: { } });
            send({ type: 'create_room', playerName });
            // Store our own name once we get our playerId
            const unsubscribe = useGameStore.subscribe((newState) => {
              if (newState.playerId) {
                set((prev) => ({
                  playerNames: { ...prev.playerNames, [newState.playerId!]: playerName },
                }));
                unsubscribe();
              }
            });
          }
        }, 100);
        return;
      }
      set({ lobbyState: 'creating', playerNames: {} });
      send({ type: 'create_room', playerName });
      // Store our own name once we get our playerId
      const unsubscribe = useGameStore.subscribe((newState) => {
        if (newState.playerId) {
          set((prev) => ({
            playerNames: { ...prev.playerNames, [newState.playerId!]: playerName },
          }));
          unsubscribe();
        }
      });
    },

    joinRoom: (roomCode: string, playerName: string) => {
      const state = get();
      if (state.connectionStatus !== 'connected') {
        connectWs();
        const checkInterval = setInterval(() => {
          const s = get();
          if (s.connectionStatus === 'connected') {
            clearInterval(checkInterval);
            set({ lobbyState: 'joining', roomCode });
            send({ type: 'join_room', roomCode, playerName });
            const unsubscribe = useGameStore.subscribe((newState) => {
              if (newState.playerId) {
                set((prev) => ({
                  playerNames: { ...prev.playerNames, [newState.playerId!]: playerName },
                }));
                unsubscribe();
              }
            });
          }
        }, 100);
        return;
      }
      set({ lobbyState: 'joining', roomCode });
      send({ type: 'join_room', roomCode, playerName });
      const unsubscribe = useGameStore.subscribe((newState) => {
        if (newState.playerId) {
          set((prev) => ({
            playerNames: { ...prev.playerNames, [newState.playerId!]: playerName },
          }));
          unsubscribe();
        }
      });
    },

    chooseCard: (cardTypeId: string) => {
      send({ type: 'choose_card', cardTypeId });
    },

    chooseKeep: (keepNew: boolean) => {
      send({ type: 'choose_keep', keepNew });
    },

    chooseSpace: (targetSpace: SpaceNumber) => {
      send({ type: 'choose_space', targetSpace });
    },

    nextRound: () => {
      send({ type: 'next_round' });
    },

    playAgain: () => {
      send({ type: 'play_again' });
      set({
        gameState: null,
        lobbyState: 'waiting',
      });
    },

    clearError: () => {
      set({ errorMessage: null });
    },
  };
});
