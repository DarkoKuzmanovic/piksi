import type { CardType, SpaceNumber, Color } from './types.js';

export const DECK: readonly CardType[] = [
  // --- Multicolor (6 cards) ---
  { cardTypeId: 'M1', number: 2, colors: ['blue','green','yellow','red'], multicolor: true, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'M2', number: 3, colors: ['blue','green','yellow','red'], multicolor: true, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'M3', number: 4, colors: ['blue','green','yellow','red'], multicolor: true, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'M4', number: 6, colors: ['blue','green','yellow','red'], multicolor: true, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'M5', number: 7, colors: ['blue','green','yellow','red'], multicolor: true, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'M6', number: 8, colors: ['blue','green','yellow','red'], multicolor: true, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },

  // --- Blue (16 cards) ---
  { cardTypeId: 'B1',  number: 1, colors: ['blue'], multicolor: false, spirals: 6, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B2',  number: 2, colors: ['blue'], multicolor: false, spirals: 4, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B3',  number: 3, colors: ['blue'], multicolor: false, spirals: 3, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B4',  number: 3, colors: ['blue'], multicolor: false, spirals: 1, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B5',  number: 4, colors: ['blue'], multicolor: false, spirals: 1, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B6',  number: 4, colors: ['blue'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: 'blue' },
  { cardTypeId: 'B7',  number: 4, colors: ['blue'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B8',  number: 5, colors: ['blue'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B9',  number: 5, colors: ['blue'], multicolor: false, spirals: 0, crosses: 2, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B10', number: 5, colors: ['blue'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: 'blue' },
  { cardTypeId: 'B11', number: 6, colors: ['blue'], multicolor: false, spirals: 1, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B12', number: 6, colors: ['blue'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B13', number: 7, colors: ['blue'], multicolor: false, spirals: 0, crosses: 3, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B14', number: 8, colors: ['blue'], multicolor: false, spirals: 0, crosses: 3, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B15', number: 9, colors: ['blue'], multicolor: false, spirals: 0, crosses: 6, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'B16', number: 9, colors: ['blue'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },

  // --- Green (16 cards) ---
  { cardTypeId: 'G1',  number: 1, colors: ['green'], multicolor: false, spirals: 5, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G2',  number: 2, colors: ['green'], multicolor: false, spirals: 3, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G3',  number: 3, colors: ['green'], multicolor: false, spirals: 2, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G4',  number: 3, colors: ['green'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: 'green' },
  { cardTypeId: 'G5',  number: 4, colors: ['green'], multicolor: false, spirals: 4, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G6',  number: 4, colors: ['green'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G7',  number: 5, colors: ['green'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G8',  number: 5, colors: ['green'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G9',  number: 5, colors: ['green'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: 'green' },
  { cardTypeId: 'G10', number: 6, colors: ['green'], multicolor: false, spirals: 0, crosses: 4, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G11', number: 6, colors: ['green'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G12', number: 6, colors: ['green'], multicolor: false, spirals: 1, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G13', number: 7, colors: ['green'], multicolor: false, spirals: 0, crosses: 2, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G14', number: 7, colors: ['green'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G15', number: 8, colors: ['green'], multicolor: false, spirals: 0, crosses: 2, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'G16', number: 9, colors: ['green'], multicolor: false, spirals: 0, crosses: 4, specialSpiralPerFaceupColor: null },

  // --- Yellow (16 cards) ---
  { cardTypeId: 'Y1',  number: 1, colors: ['yellow'], multicolor: false, spirals: 4, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y2',  number: 2, colors: ['yellow'], multicolor: false, spirals: 2, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y3',  number: 2, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: 'yellow' },
  { cardTypeId: 'Y4',  number: 3, colors: ['yellow'], multicolor: false, spirals: 5, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y5',  number: 3, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y6',  number: 4, colors: ['yellow'], multicolor: false, spirals: 3, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y7',  number: 4, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y8',  number: 5, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 2, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y9',  number: 5, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y10', number: 5, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: 'yellow' },
  { cardTypeId: 'Y11', number: 6, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 3, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y12', number: 6, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y13', number: 7, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 5, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y14', number: 7, colors: ['yellow'], multicolor: false, spirals: 1, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y15', number: 8, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'Y16', number: 9, colors: ['yellow'], multicolor: false, spirals: 0, crosses: 2, specialSpiralPerFaceupColor: null },

  // --- Red (16 cards) ---
  { cardTypeId: 'R1',  number: 1, colors: ['red'], multicolor: false, spirals: 3, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R2',  number: 1, colors: ['red'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: 'red' },
  { cardTypeId: 'R3',  number: 2, colors: ['red'], multicolor: false, spirals: 5, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R4',  number: 3, colors: ['red'], multicolor: false, spirals: 4, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R5',  number: 4, colors: ['red'], multicolor: false, spirals: 2, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R6',  number: 4, colors: ['red'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R7',  number: 5, colors: ['red'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R8',  number: 5, colors: ['red'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: 'red' },
  { cardTypeId: 'R9',  number: 5, colors: ['red'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R10', number: 6, colors: ['red'], multicolor: false, spirals: 0, crosses: 2, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R11', number: 6, colors: ['red'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R12', number: 7, colors: ['red'], multicolor: false, spirals: 0, crosses: 4, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R13', number: 7, colors: ['red'], multicolor: false, spirals: 0, crosses: 1, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R14', number: 8, colors: ['red'], multicolor: false, spirals: 0, crosses: 5, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R15', number: 8, colors: ['red'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
  { cardTypeId: 'R16', number: 9, colors: ['red'], multicolor: false, spirals: 0, crosses: 0, specialSpiralPerFaceupColor: null },
] as const satisfies readonly CardType[];

export function createShuffledDeck(): CardType[] {
  const deck = [...DECK];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function drawCards(deck: CardType[], count: number): CardType[] {
  return deck.splice(0, count);
}
