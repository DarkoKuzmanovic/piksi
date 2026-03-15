import { describe, it, expect } from 'vitest';
import { DECK, createShuffledDeck, drawCards } from '@shared/deck';
import type { CardType } from '@shared/types';

describe('DECK', () => {
  it('has exactly 70 cards', () => {
    expect(DECK).toHaveLength(70);
  });

  it('follows bell curve distribution by number', () => {
    const counts = new Map<number, number>();
    for (const card of DECK) {
      counts.set(card.number, (counts.get(card.number) ?? 0) + 1);
    }
    expect(counts.get(1)).toBe(5);
    expect(counts.get(2)).toBe(6);
    expect(counts.get(3)).toBe(8);
    expect(counts.get(4)).toBe(10);
    expect(counts.get(5)).toBe(12);
    expect(counts.get(6)).toBe(10);
    expect(counts.get(7)).toBe(8);
    expect(counts.get(8)).toBe(6);
    expect(counts.get(9)).toBe(5);
  });

  it('has correct color distribution', () => {
    const multi = DECK.filter(c => c.multicolor);
    const blue = DECK.filter(c => !c.multicolor && c.colors[0] === 'blue');
    const green = DECK.filter(c => !c.multicolor && c.colors[0] === 'green');
    const yellow = DECK.filter(c => !c.multicolor && c.colors[0] === 'yellow');
    const red = DECK.filter(c => !c.multicolor && c.colors[0] === 'red');

    expect(multi).toHaveLength(6);
    expect(blue).toHaveLength(16);
    expect(green).toHaveLength(16);
    expect(yellow).toHaveLength(16);
    expect(red).toHaveLength(16);
  });

  it('has exactly 8 special cards', () => {
    const specials = DECK.filter(c => c.specialSpiralPerFaceupColor !== null);
    expect(specials).toHaveLength(8);
  });

  it('has unique cardTypeIds', () => {
    const ids = DECK.map(c => c.cardTypeId);
    expect(new Set(ids).size).toBe(70);
  });

  it('every card has valid number 1-9', () => {
    for (const card of DECK) {
      expect(card.number).toBeGreaterThanOrEqual(1);
      expect(card.number).toBeLessThanOrEqual(9);
    }
  });

  it('multicolor cards have all 4 colors', () => {
    for (const card of DECK.filter(c => c.multicolor)) {
      expect(card.colors).toEqual(['blue', 'green', 'yellow', 'red']);
    }
  });
});

describe('createShuffledDeck', () => {
  it('returns 70 cards', () => {
    const deck = createShuffledDeck();
    expect(deck).toHaveLength(70);
  });

  it('contains same cards as DECK (just reordered)', () => {
    const deck = createShuffledDeck();
    const sortById = (a: CardType, b: CardType) => a.cardTypeId.localeCompare(b.cardTypeId);
    expect([...deck].sort(sortById)).toEqual([...DECK].sort(sortById));
  });
});

describe('drawCards', () => {
  it('draws N cards from top of deck', () => {
    const deck = [...DECK];
    const drawn = drawCards(deck, 4);
    expect(drawn).toHaveLength(4);
    expect(deck).toHaveLength(66);
  });

  it('drawn cards are removed from deck', () => {
    const deck = [...DECK];
    const top4 = deck.slice(0, 4);
    const drawn = drawCards(deck, 4);
    expect(drawn).toEqual(top4);
    expect(deck).toHaveLength(66);
  });
});
