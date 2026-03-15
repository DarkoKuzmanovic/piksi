import type { PlayerBoard, CardType, SpaceNumber } from './types';
import { getEmptySpaces } from './board';

export type PlacementChoice =
  | { type: 'choose_keep'; keepNew: boolean }
  | { type: 'choose_space'; targetSpace: SpaceNumber };

export type PlacementResult =
  | { case: 1; spaceNumber: SpaceNumber }
  | { case: 2; spaceNumber: SpaceNumber; needsChoice: true }
  | { case: 3; emptySpaces: SpaceNumber[] };

export function legalDestinations(board: PlayerBoard, cardNumber: SpaceNumber): SpaceNumber[] {
  const target = board[cardNumber];
  if (target.state === 'EMPTY' || target.state === 'FACEDOWN_ONLY' || target.state === 'FACEUP_ONLY') {
    return [cardNumber];
  }
  return getEmptySpaces(board);
}

export function getPlacementCase(board: PlayerBoard, cardNumber: SpaceNumber): PlacementResult {
  const target = board[cardNumber];
  if (target.state === 'EMPTY' || target.state === 'FACEDOWN_ONLY') {
    return { case: 1, spaceNumber: cardNumber };
  }
  if (target.state === 'FACEUP_ONLY') {
    return { case: 2, spaceNumber: cardNumber, needsChoice: true };
  }
  return { case: 3, emptySpaces: getEmptySpaces(board) };
}

export function resolvePlacement(
  board: PlayerBoard,
  card: CardType,
  choice?: PlacementChoice
): void {
  const n = card.number;
  const target = board[n];

  if (target.state === 'EMPTY') {
    board[n] = { state: 'FACEUP_ONLY', topCard: card, bottomCard: null };
    return;
  }

  if (target.state === 'FACEDOWN_ONLY') {
    board[n] = { state: 'VALIDATED', topCard: card, bottomCard: target.bottomCard };
    return;
  }

  if (target.state === 'FACEUP_ONLY') {
    if (!choice || choice.type !== 'choose_keep') {
      throw new Error('Case 2 requires a choose_keep choice');
    }
    if (choice.keepNew) {
      board[n] = { state: 'VALIDATED', topCard: card, bottomCard: target.topCard };
    } else {
      board[n] = { state: 'VALIDATED', topCard: target.topCard, bottomCard: card };
    }
    return;
  }

  if (!choice || choice.type !== 'choose_space') {
    throw new Error('Case 3 requires a choose_space choice');
  }
  const t = choice.targetSpace;
  if (board[t].state !== 'EMPTY') {
    throw new Error(`Space ${t} is not empty`);
  }
  board[t] = { state: 'FACEDOWN_ONLY', topCard: null, bottomCard: card };
}
