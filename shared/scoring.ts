import type { PlayerBoard, RoundNumber, CardType, SpaceNumber } from './types.js';
import { SPACE_NUMBERS, COLORS, ADJACENCY, ZONE_MULTIPLIER } from './constants.js';
import { getFaceupCards } from './board.js';

export function scoreValidated(board: PlayerBoard): number {
  let total = 0;
  for (const n of SPACE_NUMBERS) {
    if (board[n].state === 'VALIDATED') {
      total += n;
    }
  }
  return total;
}

export function scoreSymbols(board: PlayerBoard): number {
  const faceupCards = getFaceupCards(board);

  const colorCounts: Record<string, number> = {};
  for (const color of COLORS) {
    colorCounts[color] = 0;
  }
  for (const card of faceupCards) {
    for (const color of card.colors) {
      colorCounts[color]++;
    }
  }

  let points = 0;
  for (const card of faceupCards) {
    points += card.spirals;
    points -= card.crosses;
    if (card.specialSpiralPerFaceupColor) {
      points += colorCounts[card.specialSpiralPerFaceupColor];
    }
  }
  return points;
}

export function scoreLargestZone(board: PlayerBoard, roundNumber: RoundNumber): number {
  const faceupMap = new Map<SpaceNumber, CardType>();
  for (const n of SPACE_NUMBERS) {
    const space = board[n];
    if ((space.state === 'FACEUP_ONLY' || space.state === 'VALIDATED') && space.topCard) {
      faceupMap.set(n, space.topCard);
    }
  }

  let largest = 0;

  for (const color of COLORS) {
    const nodes = new Set<SpaceNumber>();
    for (const [spaceNum, card] of faceupMap) {
      if (card.colors.includes(color)) {
        nodes.add(spaceNum);
      }
    }

    const visited = new Set<SpaceNumber>();
    for (const start of nodes) {
      if (visited.has(start)) continue;
      const queue: SpaceNumber[] = [start];
      const component = new Set<SpaceNumber>();
      visited.add(start);
      component.add(start);
      while (queue.length > 0) {
        const current = queue.shift()!;
        for (const neighbor of ADJACENCY[current]) {
          if (nodes.has(neighbor) && !visited.has(neighbor)) {
            visited.add(neighbor);
            component.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      if (component.size >= 2) {
        largest = Math.max(largest, component.size);
      }
    }
  }

  return largest * ZONE_MULTIPLIER[roundNumber];
}

export function scoreRound(board: PlayerBoard, roundNumber: RoundNumber): number {
  return scoreValidated(board) + scoreSymbols(board) + scoreLargestZone(board, roundNumber);
}
