import type { PlayerBoard, Space, SpaceNumber, CardType } from './types.js';
import { SPACE_NUMBERS } from './constants.js';

export function createEmptyBoard(): PlayerBoard {
  const board = {} as PlayerBoard;
  for (const n of SPACE_NUMBERS) {
    board[n] = { state: 'EMPTY', topCard: null, bottomCard: null };
  }
  return board;
}

export function getOccupiedCount(board: PlayerBoard): number {
  return SPACE_NUMBERS.filter(n => board[n].state !== 'EMPTY').length;
}

export function getEmptySpaces(board: PlayerBoard): SpaceNumber[] {
  return SPACE_NUMBERS.filter(n => board[n].state === 'EMPTY');
}

export function getFaceupCards(board: PlayerBoard): CardType[] {
  const cards: CardType[] = [];
  for (const n of SPACE_NUMBERS) {
    const space = board[n];
    if ((space.state === 'FACEUP_ONLY' || space.state === 'VALIDATED') && space.topCard) {
      cards.push(space.topCard);
    }
  }
  return cards;
}
