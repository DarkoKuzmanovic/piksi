import { describe, it, expect } from 'vitest';
import { legalDestinations, resolvePlacement } from '@shared/placement';
import { createEmptyBoard } from '@shared/board';
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

describe('legalDestinations', () => {
  it('returns matching space when EMPTY', () => {
    const board = createEmptyBoard();
    expect(legalDestinations(board, 5)).toEqual([5]);
  });

  it('returns matching space when FACEDOWN_ONLY', () => {
    const board = createEmptyBoard();
    board[3] = { state: 'FACEDOWN_ONLY', topCard: null, bottomCard: makeCard(3) };
    expect(legalDestinations(board, 3)).toEqual([3]);
  });

  it('returns matching space when FACEUP_ONLY', () => {
    const board = createEmptyBoard();
    board[7] = { state: 'FACEUP_ONLY', topCard: makeCard(7), bottomCard: null };
    expect(legalDestinations(board, 7)).toEqual([7]);
  });

  it('returns all empty spaces when VALIDATED', () => {
    const board = createEmptyBoard();
    board[5] = { state: 'VALIDATED', topCard: makeCard(5), bottomCard: makeCard(5) };
    board[1] = { state: 'FACEUP_ONLY', topCard: makeCard(1), bottomCard: null };
    expect(legalDestinations(board, 5)).toEqual([2, 3, 4, 6, 7, 8, 9]);
  });

  it('returns empty array when VALIDATED and no empty spaces', () => {
    const board = createEmptyBoard();
    for (let i = 1; i <= 9; i++) {
      board[i as SpaceNumber] = { state: 'VALIDATED', topCard: makeCard(i as SpaceNumber), bottomCard: makeCard(i as SpaceNumber) };
    }
    expect(legalDestinations(board, 5)).toEqual([]);
  });
});

describe('resolvePlacement', () => {
  it('Case 1a: EMPTY -> FACEUP_ONLY', () => {
    const board = createEmptyBoard();
    const card = makeCard(5, { cardTypeId: 'B8' });
    resolvePlacement(board, card);
    expect(board[5].state).toBe('FACEUP_ONLY');
    expect(board[5].topCard).toBe(card);
    expect(board[5].bottomCard).toBeNull();
  });

  it('Case 1b: FACEDOWN_ONLY -> VALIDATED (instant validation)', () => {
    const board = createEmptyBoard();
    const bottomCard = makeCard(5, { cardTypeId: 'BOTTOM' });
    board[5] = { state: 'FACEDOWN_ONLY', topCard: null, bottomCard: bottomCard };
    const newCard = makeCard(5, { cardTypeId: 'TOP' });
    resolvePlacement(board, newCard);
    expect(board[5].state).toBe('VALIDATED');
    expect(board[5].topCard).toBe(newCard);
    expect(board[5].bottomCard).toBe(bottomCard);
  });

  it('Case 2: FACEUP_ONLY + keep_new -> VALIDATED with new on top', () => {
    const board = createEmptyBoard();
    const oldCard = makeCard(5, { cardTypeId: 'OLD' });
    board[5] = { state: 'FACEUP_ONLY', topCard: oldCard, bottomCard: null };
    const newCard = makeCard(5, { cardTypeId: 'NEW' });
    resolvePlacement(board, newCard, { type: 'choose_keep', keepNew: true });
    expect(board[5].state).toBe('VALIDATED');
    expect(board[5].topCard).toBe(newCard);
    expect(board[5].bottomCard).toBe(oldCard);
  });

  it('Case 2: FACEUP_ONLY + keep_old -> VALIDATED with old on top', () => {
    const board = createEmptyBoard();
    const oldCard = makeCard(5, { cardTypeId: 'OLD' });
    board[5] = { state: 'FACEUP_ONLY', topCard: oldCard, bottomCard: null };
    const newCard = makeCard(5, { cardTypeId: 'NEW' });
    resolvePlacement(board, newCard, { type: 'choose_keep', keepNew: false });
    expect(board[5].state).toBe('VALIDATED');
    expect(board[5].topCard).toBe(oldCard);
    expect(board[5].bottomCard).toBe(newCard);
  });

  it('Case 3: VALIDATED -> facedown on chosen empty space', () => {
    const board = createEmptyBoard();
    board[5] = { state: 'VALIDATED', topCard: makeCard(5), bottomCard: makeCard(5) };
    const card = makeCard(5, { cardTypeId: 'OVERFLOW' });
    resolvePlacement(board, card, { type: 'choose_space', targetSpace: 3 });
    expect(board[3].state).toBe('FACEDOWN_ONLY');
    expect(board[3].bottomCard).toBe(card);
    expect(board[3].topCard).toBeNull();
    expect(board[5].state).toBe('VALIDATED');
  });

  it('Case 3: throws if target space is not empty', () => {
    const board = createEmptyBoard();
    board[5] = { state: 'VALIDATED', topCard: makeCard(5), bottomCard: makeCard(5) };
    board[3] = { state: 'FACEUP_ONLY', topCard: makeCard(3), bottomCard: null };
    const card = makeCard(5);
    expect(() =>
      resolvePlacement(board, card, { type: 'choose_space', targetSpace: 3 })
    ).toThrow();
  });

  it('Case 2: throws if no choice provided', () => {
    const board = createEmptyBoard();
    board[5] = { state: 'FACEUP_ONLY', topCard: makeCard(5), bottomCard: null };
    const card = makeCard(5);
    expect(() => resolvePlacement(board, card)).toThrow();
  });
});
