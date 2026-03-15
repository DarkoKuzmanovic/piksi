import { describe, it, expect } from 'vitest';
import { scoreValidated, scoreSymbols, scoreLargestZone, scoreRound } from '@shared/scoring';
import { createEmptyBoard } from '@shared/board';
import type { CardType, SpaceNumber, RoundNumber } from '@shared/types';

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

describe('scoreValidated', () => {
  it('returns 0 for empty board', () => {
    expect(scoreValidated(createEmptyBoard())).toBe(0);
  });

  it('sums numbers of VALIDATED spaces only', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'VALIDATED', topCard: makeCard(1), bottomCard: makeCard(1) };
    board[5] = { state: 'VALIDATED', topCard: makeCard(5), bottomCard: makeCard(5) };
    board[7] = { state: 'VALIDATED', topCard: makeCard(7), bottomCard: makeCard(7) };
    board[8] = { state: 'VALIDATED', topCard: makeCard(8), bottomCard: makeCard(8) };
    expect(scoreValidated(board)).toBe(1 + 5 + 7 + 8); // 21
  });

  it('does NOT count FACEUP_ONLY spaces', () => {
    const board = createEmptyBoard();
    board[9] = { state: 'FACEUP_ONLY', topCard: makeCard(9), bottomCard: null };
    expect(scoreValidated(board)).toBe(0);
  });
});

describe('scoreSymbols', () => {
  it('returns 0 for empty board', () => {
    expect(scoreSymbols(createEmptyBoard())).toBe(0);
  });

  it('counts spirals as positive', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { spirals: 6 }), bottomCard: null };
    expect(scoreSymbols(board)).toBe(6);
  });

  it('counts crosses as negative', () => {
    const board = createEmptyBoard();
    board[9] = { state: 'FACEUP_ONLY', topCard: makeCard(9, { crosses: 4 }), bottomCard: null };
    expect(scoreSymbols(board)).toBe(-4);
  });

  it('counts symbols on FACEUP_ONLY and VALIDATED', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { spirals: 3 }), bottomCard: null };
    board[5] = { state: 'VALIDATED', topCard: makeCard(5, { spirals: 2, crosses: 1 }), bottomCard: makeCard(5) };
    expect(scoreSymbols(board)).toBe(3 + 2 - 1); // 4
  });

  it('ignores symbols on facedown cards', () => {
    const board = createEmptyBoard();
    board[5] = { state: 'VALIDATED', topCard: makeCard(5, { spirals: 0 }), bottomCard: makeCard(5, { spirals: 10 }) };
    expect(scoreSymbols(board)).toBe(0);
  });

  it('special card scores +1 per faceup card of target color', () => {
    const board = createEmptyBoard();
    board[4] = {
      state: 'FACEUP_ONLY',
      topCard: makeCard(4, { cardTypeId: 'B6', colors: ['blue'], specialSpiralPerFaceupColor: 'blue' }),
      bottomCard: null,
    };
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { colors: ['blue'] }), bottomCard: null };
    board[2] = { state: 'FACEUP_ONLY', topCard: makeCard(2, { colors: ['blue'] }), bottomCard: null };
    // Special counts: itself (blue) + 2 others = 3
    expect(scoreSymbols(board)).toBe(3);
  });

  it('special card counts multicolor cards as matching', () => {
    const board = createEmptyBoard();
    board[4] = {
      state: 'FACEUP_ONLY',
      topCard: makeCard(4, { specialSpiralPerFaceupColor: 'blue', colors: ['blue'] }),
      bottomCard: null,
    };
    board[2] = {
      state: 'FACEUP_ONLY',
      topCard: makeCard(2, { colors: ['blue', 'green', 'yellow', 'red'], multicolor: true }),
      bottomCard: null,
    };
    // Special sees: itself (blue) + multicolor (counts as blue) = 2
    expect(scoreSymbols(board)).toBe(2);
  });
});

describe('scoreLargestZone', () => {
  it('returns 0 for empty board', () => {
    expect(scoreLargestZone(createEmptyBoard(), 1)).toBe(0);
  });

  it('returns 0 for single isolated card', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { colors: ['blue'] }), bottomCard: null };
    expect(scoreLargestZone(board, 1)).toBe(0);
  });

  it('scores 2 adjacent same-color cards', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { colors: ['blue'] }), bottomCard: null };
    board[2] = { state: 'FACEUP_ONLY', topCard: makeCard(2, { colors: ['blue'] }), bottomCard: null };
    expect(scoreLargestZone(board, 1)).toBe(2 * 2); // size 2 x round 1 multiplier 2 = 4
  });

  it('does NOT count diagonals', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { colors: ['blue'] }), bottomCard: null };
    board[5] = { state: 'FACEUP_ONLY', topCard: makeCard(5, { colors: ['blue'] }), bottomCard: null };
    expect(scoreLargestZone(board, 1)).toBe(0);
  });

  it('multicolor card bridges zones', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { colors: ['blue'] }), bottomCard: null };
    board[2] = {
      state: 'FACEUP_ONLY',
      topCard: makeCard(2, { colors: ['blue', 'green', 'yellow', 'red'], multicolor: true }),
      bottomCard: null,
    };
    board[3] = { state: 'FACEUP_ONLY', topCard: makeCard(3, { colors: ['blue'] }), bottomCard: null };
    expect(scoreLargestZone(board, 1)).toBe(3 * 2); // 6
  });

  it('ignores facedown cards', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { colors: ['blue'] }), bottomCard: null };
    board[2] = { state: 'FACEDOWN_ONLY', topCard: null, bottomCard: makeCard(2, { colors: ['blue'] }) };
    expect(scoreLargestZone(board, 1)).toBe(0);
  });

  it('zone of 4 in round 1 = 8, round 2 = 12, round 3 = 16', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { colors: ['blue'] }), bottomCard: null };
    board[2] = { state: 'FACEUP_ONLY', topCard: makeCard(2, { colors: ['blue'] }), bottomCard: null };
    board[5] = { state: 'FACEUP_ONLY', topCard: makeCard(5, { colors: ['blue'] }), bottomCard: null };
    board[4] = { state: 'FACEUP_ONLY', topCard: makeCard(4, { colors: ['blue'] }), bottomCard: null };
    // Zone: 1-2-5-4, size 4
    expect(scoreLargestZone(board, 1)).toBe(4 * 2);
    expect(scoreLargestZone(board, 2)).toBe(4 * 3);
    expect(scoreLargestZone(board, 3)).toBe(4 * 4);
  });

  it('only scores the single largest zone', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1, { colors: ['blue'] }), bottomCard: null };
    board[2] = { state: 'FACEUP_ONLY', topCard: makeCard(2, { colors: ['blue'] }), bottomCard: null };
    board[7] = { state: 'FACEUP_ONLY', topCard: makeCard(7, { colors: ['red'] }), bottomCard: null };
    board[8] = { state: 'FACEUP_ONLY', topCard: makeCard(8, { colors: ['red'] }), bottomCard: null };
    board[9] = { state: 'FACEUP_ONLY', topCard: makeCard(9, { colors: ['red'] }), bottomCard: null };
    // Largest = red zone of 3
    expect(scoreLargestZone(board, 1)).toBe(3 * 2); // 6
  });
});

describe('scoreRound', () => {
  it('combines all three components', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'VALIDATED', topCard: makeCard(1, { spirals: 3, colors: ['blue'] }), bottomCard: makeCard(1) };
    board[5] = { state: 'VALIDATED', topCard: makeCard(5, { colors: ['blue'] }), bottomCard: makeCard(5) };
    board[2] = { state: 'FACEUP_ONLY', topCard: makeCard(2, { spirals: 1, colors: ['blue'] }), bottomCard: null };
    // validated: 1+5 = 6
    // symbols: 3+1 = 4
    // zone: 1-2-5 are all blue and adjacent (1-2, 2-5) = size 3, round 1 = 6
    expect(scoreRound(board, 1)).toBe(6 + 4 + 6); // 16
  });
});
