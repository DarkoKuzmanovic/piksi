import { describe, it, expect } from 'vitest';
import { createEmptyBoard, getOccupiedCount, getFaceupCards, getEmptySpaces } from '@shared/board';
import type { CardType, SpaceNumber } from '@shared/types';

const makeCard = (overrides: Partial<CardType> = {}): CardType => ({
  cardTypeId: 'TEST',
  number: 5,
  colors: ['blue'],
  multicolor: false,
  spirals: 0,
  crosses: 0,
  specialSpiralPerFaceupColor: null,
  ...overrides,
});

describe('createEmptyBoard', () => {
  it('has 9 spaces all EMPTY', () => {
    const board = createEmptyBoard();
    for (let i = 1; i <= 9; i++) {
      const space = board[i as SpaceNumber];
      expect(space.state).toBe('EMPTY');
      expect(space.topCard).toBeNull();
      expect(space.bottomCard).toBeNull();
    }
  });
});

describe('getOccupiedCount', () => {
  it('returns 0 for empty board', () => {
    expect(getOccupiedCount(createEmptyBoard())).toBe(0);
  });

  it('counts non-empty spaces', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(), bottomCard: null };
    board[5] = { state: 'FACEDOWN_ONLY', topCard: null, bottomCard: makeCard() };
    expect(getOccupiedCount(board)).toBe(2);
  });
});

describe('getEmptySpaces', () => {
  it('returns all 9 for empty board', () => {
    expect(getEmptySpaces(createEmptyBoard())).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('excludes occupied spaces', () => {
    const board = createEmptyBoard();
    board[3] = { state: 'FACEUP_ONLY', topCard: makeCard(), bottomCard: null };
    expect(getEmptySpaces(board)).toEqual([1, 2, 4, 5, 6, 7, 8, 9]);
  });
});

describe('getFaceupCards', () => {
  it('returns empty array for empty board', () => {
    expect(getFaceupCards(createEmptyBoard())).toEqual([]);
  });

  it('returns faceup cards from FACEUP_ONLY and VALIDATED spaces', () => {
    const board = createEmptyBoard();
    const card1 = makeCard({ cardTypeId: 'A' });
    const card2 = makeCard({ cardTypeId: 'B' });
    board[1] = { state: 'FACEUP_ONLY', topCard: card1, bottomCard: null };
    board[5] = { state: 'VALIDATED', topCard: card2, bottomCard: makeCard() };
    const faceup = getFaceupCards(board);
    expect(faceup).toHaveLength(2);
    expect(faceup.map(c => c.cardTypeId)).toEqual(['A', 'B']);
  });

  it('ignores FACEDOWN_ONLY spaces', () => {
    const board = createEmptyBoard();
    board[1] = { state: 'FACEDOWN_ONLY', topCard: null, bottomCard: makeCard() };
    expect(getFaceupCards(board)).toEqual([]);
  });
});
