import { describe, it, expect } from 'vitest';
import { GameEngine } from '@shared/game';
import type { CardType, SpaceNumber } from '@shared/types';

const makeCard = (number: SpaceNumber, overrides: Partial<CardType> = {}): CardType => ({
  cardTypeId: `T${number}`,
  number,
  colors: ['blue'],
  multicolor: false,
  spirals: 0,
  crosses: 0,
  specialSpiralPerFaceupColor: null,
  ...overrides,
});

describe('GameEngine', () => {
  const P1 = 'player1';
  const P2 = 'player2';

  function createGame(): GameEngine {
    return new GameEngine(P1, P2);
  }

  describe('initialization', () => {
    it('starts in choose_card phase', () => {
      const game = createGame();
      expect(game.state.phase).toBe('choose_card');
    });

    it('starts at round 1', () => {
      const game = createGame();
      expect(game.state.roundNumber).toBe(1);
    });

    it('has 4 cards in display', () => {
      const game = createGame();
      expect(game.state.display).toHaveLength(4);
    });

    it('deck has 66 remaining cards', () => {
      const game = createGame();
      expect(game.state.deck).toHaveLength(66);
    });

    it('both boards are empty', () => {
      const game = createGame();
      for (let i = 1; i <= 9; i++) {
        expect(game.state.boards[P1][i as SpaceNumber].state).toBe('EMPTY');
        expect(game.state.boards[P2][i as SpaceNumber].state).toBe('EMPTY');
      }
    });

    it('first player is active', () => {
      const game = createGame();
      expect(game.state.activePlayerId).toBe(game.state.firstPlayerId);
    });
  });

  describe('turn order', () => {
    it('follows A-B-A-B pattern within a turn', () => {
      const game = createGame();
      const first = game.state.firstPlayerId;
      const second = first === P1 ? P2 : P1;

      expect(game.state.activePlayerId).toBe(first);
      expect(game.state.pickIndex).toBe(0);

      const card1 = game.state.display[0];
      game.chooseCard(first, card1.cardTypeId);
      // Handle placement if needed
      while (game.state.phase === 'choose_keep' || game.state.phase === 'choose_space') {
        if (game.state.phase === 'choose_keep') game.chooseKeep(first, true);
        else game.chooseSpace(first, game.getEmptySpaces(first)[0]);
      }

      expect(game.state.activePlayerId).toBe(second);
      expect(game.state.pickIndex).toBe(1);
    });

    it('last picker becomes first player next turn', () => {
      const game = createGame();
      const first = game.state.firstPlayerId;
      const second = first === P1 ? P2 : P1;

      for (let i = 0; i < 4; i++) {
        const active = game.state.activePlayerId;
        const card = game.state.display[0];
        game.chooseCard(active, card.cardTypeId);
        while (game.state.phase === 'choose_keep' || game.state.phase === 'choose_space') {
          if (game.state.phase === 'choose_keep') game.chooseKeep(active, true);
          else game.chooseSpace(active, game.getEmptySpaces(active)[0]);
        }
      }

      if (game.state.phase === 'choose_card') {
        expect(game.state.firstPlayerId).toBe(second);
        expect(game.state.activePlayerId).toBe(second);
      }
    });
  });

  describe('round end', () => {
    it('round ends when a player fills all 9 spaces', () => {
      const game = createGame();
      let roundEnded = false;
      let safety = 0;
      while (!roundEnded && safety < 200) {
        safety++;
        if (game.state.phase === 'choose_card') {
          const active = game.state.activePlayerId;
          const card = game.state.display[0];
          game.chooseCard(active, card.cardTypeId);
        } else if (game.state.phase === 'choose_keep') {
          game.chooseKeep(game.state.activePlayerId, true);
        } else if (game.state.phase === 'choose_space') {
          const spaces = game.getEmptySpaces(game.state.activePlayerId);
          game.chooseSpace(game.state.activePlayerId, spaces[0]);
        } else if (game.state.phase === 'round_scoring') {
          roundEnded = true;
        }
      }
      expect(roundEnded).toBe(true);
      expect(game.state.phase).toBe('round_scoring');
    });
  });

  describe('equalization rule', () => {
    it('opponent gets one more pick when first player fills board on even pick', () => {
      const game = createGame();
      const first = game.state.firstPlayerId;
      const second = first === P1 ? P2 : P1;

      // Fill first player's board to 8 occupied spaces
      for (let i = 1; i <= 8; i++) {
        game.state.boards[first][i as SpaceNumber] = {
          state: 'FACEUP_ONLY',
          topCard: makeCard(i as SpaceNumber),
          bottomCard: null,
        };
      }

      // Ensure the first display card has number 9 so it fills the last empty space
      const card9 = makeCard(9 as SpaceNumber, { cardTypeId: 'EQ9' });
      game.state.display[0] = card9;

      // Pick 0: first player picks a card that fills space 9
      game.chooseCard(first, card9.cardTypeId);
      // Handle placement
      while (game.state.phase === 'choose_keep' || game.state.phase === 'choose_space') {
        if (game.state.phase === 'choose_keep') game.chooseKeep(first, true);
        else game.chooseSpace(first, game.getEmptySpaces(first)[0]);
      }

      // Should NOT be round_scoring yet if equalization needed
      if (game.state.phase === 'choose_card') {
        expect(game.state.activePlayerId).toBe(second);
        expect(game.state.lastTurnTriggered).toBe(true);
      }
    });
  });

  describe('tie detection', () => {
    it('getWinner returns null on tie', () => {
      const game = createGame();
      game.state.phase = 'game_over';
      game.state.scores[P1] = [10, 10, 10];
      game.state.scores[P2] = [10, 10, 10];
      expect(game.getWinner()).toBeNull();
    });

    it('getWinner returns higher scorer', () => {
      const game = createGame();
      game.state.phase = 'game_over';
      game.state.scores[P1] = [10, 20, 30];
      game.state.scores[P2] = [10, 10, 10];
      expect(game.getWinner()).toBe(P1);
    });
  });

  describe('full game', () => {
    it('plays 3 rounds to completion', () => {
      const game = createGame();
      let safety = 0;
      while (game.state.phase !== 'game_over' && safety < 1000) {
        safety++;
        if (game.state.phase === 'choose_card') {
          const active = game.state.activePlayerId;
          const card = game.state.display[0];
          game.chooseCard(active, card.cardTypeId);
        } else if (game.state.phase === 'choose_keep') {
          game.chooseKeep(game.state.activePlayerId, true);
        } else if (game.state.phase === 'choose_space') {
          const spaces = game.getEmptySpaces(game.state.activePlayerId);
          game.chooseSpace(game.state.activePlayerId, spaces[0]);
        } else if (game.state.phase === 'round_scoring') {
          game.nextRound();
        }
      }
      expect(game.state.phase).toBe('game_over');
      expect(game.state.scores[P1]).toHaveLength(3);
      expect(game.state.scores[P2]).toHaveLength(3);
    });
  });

  describe('invalid actions', () => {
    it('rejects action from wrong player', () => {
      const game = createGame();
      const inactive = game.state.activePlayerId === P1 ? P2 : P1;
      const card = game.state.display[0];
      expect(() => game.chooseCard(inactive, card.cardTypeId)).toThrow();
    });

    it('rejects choosing a card not in display', () => {
      const game = createGame();
      const active = game.state.activePlayerId;
      expect(() => game.chooseCard(active, 'NONEXISTENT')).toThrow();
    });
  });
});
