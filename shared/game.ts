import type { MatchState, CardType, SpaceNumber, RoundNumber, PickIndex, PlayerBoard } from './types';
import { createShuffledDeck, drawCards } from './deck';
import { createEmptyBoard, getOccupiedCount, getEmptySpaces as getBoardEmptySpaces } from './board';
import { resolvePlacement, getPlacementCase, type PlacementChoice } from './placement';
import { scoreRound } from './scoring';

export class GameEngine {
  state: MatchState;

  constructor(player1Id: string, player2Id: string) {
    const deck = createShuffledDeck();
    const display = drawCards(deck, 4);
    const firstPlayerId = Math.random() < 0.5 ? player1Id : player2Id;

    this.state = {
      roundNumber: 1 as RoundNumber,
      turnNumber: 1,
      pickIndex: 0 as PickIndex,
      firstPlayerId,
      activePlayerId: firstPlayerId,
      phase: 'choose_card',
      display,
      lastTurnTriggered: false,
      boards: {
        [player1Id]: createEmptyBoard(),
        [player2Id]: createEmptyBoard(),
      },
      scores: {
        [player1Id]: [],
        [player2Id]: [],
      },
      deck,
      playerIds: [player1Id, player2Id],
      pendingCard: null,
    };
  }

  private opponent(playerId: string): string {
    return this.state.playerIds[0] === playerId
      ? this.state.playerIds[1]
      : this.state.playerIds[0];
  }

  private assertActive(playerId: string): void {
    if (playerId !== this.state.activePlayerId) {
      throw new Error(`Not ${playerId}'s turn`);
    }
  }

  private assertPhase(expected: string): void {
    if (this.state.phase !== expected) {
      throw new Error(`Expected phase ${expected}, got ${this.state.phase}`);
    }
  }

  chooseCard(playerId: string, cardTypeId: string): void {
    this.assertActive(playerId);
    this.assertPhase('choose_card');

    const idx = this.state.display.findIndex(c => c.cardTypeId === cardTypeId);
    if (idx === -1) throw new Error(`Card ${cardTypeId} not in display`);

    const card = this.state.display.splice(idx, 1)[0];
    const board = this.state.boards[playerId];
    const placementCase = getPlacementCase(board, card.number);

    if (placementCase.case === 1) {
      resolvePlacement(board, card);
      this.afterPlacement(playerId);
    } else if (placementCase.case === 2) {
      this.state.pendingCard = card;
      this.state.phase = 'choose_keep';
    } else {
      // Case 3
      if (placementCase.emptySpaces.length === 0) {
        // No empty spaces available — end round immediately
        this.endRound();
        return;
      }
      this.state.pendingCard = card;
      this.state.phase = 'choose_space';
    }
  }

  chooseKeep(playerId: string, keepNew: boolean): void {
    this.assertActive(playerId);
    this.assertPhase('choose_keep');
    if (!this.state.pendingCard) throw new Error('No pending card');

    const board = this.state.boards[playerId];
    resolvePlacement(board, this.state.pendingCard, { type: 'choose_keep', keepNew });
    this.state.pendingCard = null;
    this.afterPlacement(playerId);
  }

  chooseSpace(playerId: string, targetSpace: SpaceNumber): void {
    this.assertActive(playerId);
    this.assertPhase('choose_space');
    if (!this.state.pendingCard) throw new Error('No pending card');

    const board = this.state.boards[playerId];
    resolvePlacement(board, this.state.pendingCard, { type: 'choose_space', targetSpace });
    this.state.pendingCard = null;
    this.afterPlacement(playerId);
  }

  getEmptySpaces(playerId: string): SpaceNumber[] {
    return getBoardEmptySpaces(this.state.boards[playerId]);
  }

  private afterPlacement(playerId: string): void {
    if (this.checkRoundEnd(playerId)) return;
    this.advancePick();
  }

  private checkRoundEnd(playerId: string): boolean {
    const occupied = getOccupiedCount(this.state.boards[playerId]);
    if (occupied < 9) {
      // Check if lastTurnTriggered by the other player — equalization pick done
      if (this.state.lastTurnTriggered) {
        this.endRound();
        return true;
      }
      return false;
    }

    // Player filled their board
    if (this.state.lastTurnTriggered) {
      this.endRound();
      return true;
    }

    // Check equalization: does the opponent need one more pick?
    const pickIndex = this.state.pickIndex;

    // Picks within a turn: 0=first, 1=second, 2=first, 3=second
    // If pickIndex is even (0,2), first player just played an extra card -> unequal
    // If pickIndex is odd (1,3), both have played same number -> equal
    if (pickIndex % 2 === 0) {
      // Unequal — opponent gets one more pick
      this.state.lastTurnTriggered = true;
      this.state.pickIndex = (pickIndex + 1) as PickIndex;
      this.state.activePlayerId = this.opponent(this.state.firstPlayerId);
      this.state.phase = 'choose_card';
      return true; // Skip advancePick — equalization pick is set up
    } else {
      // Equal — end round
      this.endRound();
      return true;
    }
  }

  private advancePick(): void {
    const s = this.state;
    const nextPick = (s.pickIndex + 1) as PickIndex;

    if (nextPick >= 4 || s.display.length === 0) {
      this.startNewTurn();
      return;
    }

    s.pickIndex = nextPick;

    if (nextPick % 2 === 0) {
      s.activePlayerId = s.firstPlayerId;
    } else {
      s.activePlayerId = this.opponent(s.firstPlayerId);
    }
    s.phase = 'choose_card';
  }

  private startNewTurn(): void {
    const s = this.state;
    if (s.deck.length < 4) {
      this.endRound();
      return;
    }

    // Last picker becomes first player
    s.firstPlayerId = s.activePlayerId;
    s.activePlayerId = s.firstPlayerId;
    s.turnNumber++;
    s.pickIndex = 0 as PickIndex;
    s.display = drawCards(s.deck, 4);
    s.phase = 'choose_card';
  }

  private endRound(): void {
    const s = this.state;
    const [p1, p2] = s.playerIds;

    // Track who made the last pick — they go first next round
    s.firstPlayerId = s.activePlayerId;

    const score1 = scoreRound(s.boards[p1], s.roundNumber);
    const score2 = scoreRound(s.boards[p2], s.roundNumber);

    s.scores[p1].push(score1);
    s.scores[p2].push(score2);
    s.phase = 'round_scoring';
  }

  nextRound(): void {
    this.assertPhase('round_scoring');
    const s = this.state;

    if (s.roundNumber >= 3) {
      s.phase = 'game_over';
      return;
    }

    const nextRound = (s.roundNumber + 1) as RoundNumber;
    const deck = createShuffledDeck();
    const display = drawCards(deck, 4);
    const [p1, p2] = s.playerIds;

    // firstPlayerId was set in endRound() to whoever made the last pick
    s.roundNumber = nextRound;
    s.turnNumber = 1;
    s.pickIndex = 0 as PickIndex;
    s.activePlayerId = s.firstPlayerId;
    s.display = display;
    s.deck = deck;
    s.lastTurnTriggered = false;
    s.pendingCard = null;
    s.boards[p1] = createEmptyBoard();
    s.boards[p2] = createEmptyBoard();
    s.phase = 'choose_card';
  }

  getWinner(): string | null {
    if (this.state.phase !== 'game_over') return null;
    const [p1, p2] = this.state.playerIds;
    const total1 = this.state.scores[p1].reduce((a, b) => a + b, 0);
    const total2 = this.state.scores[p2].reduce((a, b) => a + b, 0);
    if (total1 > total2) return p1;
    if (total2 > total1) return p2;
    return null; // tie
  }
}
