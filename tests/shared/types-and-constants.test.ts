import { describe, it, expect } from 'vitest';
import { COLORS, ADJACENCY, type Color, type SpaceNumber } from '@shared/constants';

describe('COLORS', () => {
  it('has exactly 4 colors', () => {
    expect(COLORS).toEqual(['blue', 'green', 'yellow', 'red']);
  });
});

describe('ADJACENCY', () => {
  it('center space 5 has 4 neighbors', () => {
    expect(ADJACENCY[5]).toEqual([2, 4, 6, 8]);
  });

  it('corner space 1 has 2 neighbors', () => {
    expect(ADJACENCY[1]).toEqual([2, 4]);
  });

  it('corner space 9 has 2 neighbors', () => {
    expect(ADJACENCY[9]).toEqual([6, 8]);
  });

  it('edge space 2 has 3 neighbors', () => {
    expect(ADJACENCY[2]).toEqual([1, 3, 5]);
  });

  it('all 9 spaces are defined', () => {
    const keys = Object.keys(ADJACENCY).map(Number);
    expect(keys.sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('adjacency is symmetric', () => {
    for (const [space, neighbors] of Object.entries(ADJACENCY)) {
      const s = Number(space) as SpaceNumber;
      for (const neighbor of neighbors) {
        expect(ADJACENCY[neighbor]).toContain(s);
      }
    }
  });
});
