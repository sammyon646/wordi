// src/data/puzzles.ts
export interface PuzzleData {
  across: Record<string, { clue: string; answer: string; row: number; col: number }>;
  down: Record<string, { clue: string; answer: string; row: number; col: number }>;
}

export const puzzles: PuzzleData[] = [
  // Level 1
  {
    across: {
      '1': { clue: 'Meows (cat)', answer: 'CAT', row: 0, col: 0 },
      '3': { clue: 'Red fruit (apple)', answer: 'APPLE', row: 2, col: 0 },
    },
    down: {
      '1': { clue: 'Vehicle (car)', answer: 'CAR', row: 0, col: 0 },
      '2': { clue: 'Barks (dog)', answer: 'DOG', row: 0, col: 2 },
    },
  },

  // Level 2
  {
    across: {
      '1': { clue: 'Yellow fruit (banana)', answer: 'BANANA', row: 1, col: 0 },
      '4': { clue: 'You read it (book)', answer: 'BOOK', row: 3, col: 1 },
    },
    down: {
      '2': { clue: 'Mobile device (phone)', answer: 'PHONE', row: 0, col: 3 },
      '3': { clue: 'Two wheels (bike)', answer: 'BIKE', row: 1, col: 5 },
    },
  },

  // Level 3
  {
    across: {
      '1': { clue: 'Shines in the sky (sun)', answer: 'SUN', row: 0, col: 2 },
      '3': { clue: 'Feeling (love)', answer: 'LOVE', row: 2, col: 0 },
    },
    down: {
      '1': { clue: 'Italian food (pizza)', answer: 'PIZZA', row: 0, col: 4 },
      '2': { clue: 'Flows to the sea (river)', answer: 'RIVER', row: 1, col: 2 },
    },
  },

  // Level 4
  {
    across: {
      '1': { clue: 'Morning drink (coffee)', answer: 'COFFEE', row: 0, col: 0 },
      '3': { clue: 'Plays music (guitar)', answer: 'GUITAR', row: 2, col: 1 },
    },
    down: {
      '2': { clue: 'City of love (Paris)', answer: 'PARIS', row: 0, col: 3 },
      '4': { clue: 'Big city (London)', answer: 'LONDON', row: 1, col: 5 },
    },
  },
]