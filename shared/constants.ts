import type { Color, SpaceNumber } from './types';

export type { Color, SpaceNumber };

export const COLORS: Color[] = ['blue', 'green', 'yellow', 'red'];

export const SPACE_NUMBERS: SpaceNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const ADJACENCY: Record<SpaceNumber, SpaceNumber[]> = {
  1: [2, 4],
  2: [1, 3, 5],
  3: [2, 6],
  4: [1, 5, 7],
  5: [2, 4, 6, 8],
  6: [3, 5, 9],
  7: [4, 8],
  8: [5, 7, 9],
  9: [6, 8],
};

export const ZONE_MULTIPLIER: Record<1 | 2 | 3, number> = {
  1: 2,
  2: 3,
  3: 4,
};
