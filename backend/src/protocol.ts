import type { SpaceNumber, CardType, PlayerBoard, RoundNumber, GamePhase } from '../../shared/types.js';

// Client -> Server messages
export type ClientMessage =
  | { type: 'create_room'; playerName: string }
  | { type: 'join_room'; roomCode: string; playerName: string }
  | { type: 'choose_card'; cardTypeId: string }
  | { type: 'choose_keep'; keepNew: boolean }
  | { type: 'choose_space'; targetSpace: SpaceNumber }
  | { type: 'next_round' }
  | { type: 'play_again' };

// Server -> Client messages
export type ServerMessage =
  | { type: 'room_created'; roomCode: string; playerId: string }
  | { type: 'room_joined'; playerId: string; playerNames: Record<string, string> }
  | { type: 'player_joined'; playerName: string }
  | { type: 'game_started' }
  | { type: 'game_state'; state: ClientGameState }
  | { type: 'error'; message: string };

// Filtered game state sent to clients (no deck, opponent facedowns hidden)
export interface ClientGameState {
  roundNumber: RoundNumber;
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
