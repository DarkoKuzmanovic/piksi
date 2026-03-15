export type Color = 'blue' | 'green' | 'yellow' | 'red';

export type SpaceNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface CardType {
  cardTypeId: string;
  number: SpaceNumber;
  colors: Color[];
  multicolor: boolean;
  spirals: number;
  crosses: number;
  specialSpiralPerFaceupColor: Color | null;
}

export type SpaceState = 'EMPTY' | 'FACEDOWN_ONLY' | 'FACEUP_ONLY' | 'VALIDATED';

export interface Space {
  state: SpaceState;
  topCard: CardType | null;
  bottomCard: CardType | null;
}

export type PlayerBoard = Record<SpaceNumber, Space>;

export type GamePhase =
  | 'lobby'
  | 'choose_card'
  | 'choose_keep'
  | 'choose_space'
  | 'round_scoring'
  | 'game_over';

export type RoundNumber = 1 | 2 | 3;

export type PickIndex = 0 | 1 | 2 | 3;

export interface MatchState {
  roundNumber: RoundNumber;
  turnNumber: number;
  pickIndex: PickIndex;
  firstPlayerId: string;
  activePlayerId: string;
  phase: GamePhase;
  display: CardType[];
  lastTurnTriggered: boolean;
  boards: Record<string, PlayerBoard>;
  scores: Record<string, number[]>;
  deck: CardType[];
  playerIds: [string, string];
  pendingCard: CardType | null;
}
