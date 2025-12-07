// src/data/puzzles.ts
export interface Entry {
  id: string;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface Puzzle {
  across: Record<string, { clue: string; answer: string; row: number; col: number }>;
  down: Record<string, { clue: string; answer: string; row: number; col: number }>;
}

/**
 * Все пересечения согласованы: одинаковые клетки содержат одинаковые буквы.
 * В каждом уровне 3–5 слов, расположенных по горизонтали и вертикали.
 */
export const puzzles: Puzzle[] = [
  // Level 1
  {
    across: {
      '1': { clue: 'Meows (cat)', answer: 'CAT', row: 0, col: 0 },
      '3': { clue: 'Hot drink (tea)', answer: 'TEA', row: 2, col: 1 },
      '5': { clue: 'Line to follow (row)', answer: 'ROW', row: 4, col: 0 },
    },
    down: {
      '1': { clue: 'Farm animal (cow)', answer: 'COW', row: 0, col: 0 },
      '2': { clue: 'Insect (ant)', answer: 'ANT', row: 0, col: 1 },
      '4': { clue: 'Foot digit (toe)', answer: 'TOE', row: 0, col: 2 },
    },
  },

  // Level 2
  {
    across: {
      '1': { clue: 'Map drawing (map)', answer: 'MAP', row: 0, col: 0 },
      '3': { clue: 'A straight path (line)', answer: 'LINE', row: 2, col: 0 },
      '5': { clue: 'Short note (note)', answer: 'NOTE', row: 3, col: 1 },
    },
    down: {
      '1': { clue: 'Dairy drink (milk)', answer: 'MILK', row: 0, col: 0 },
      '2': { clue: 'Pine tree (pino)', answer: 'PINO', row: 0, col: 2 }, // слово подобрано под пересечения
    },
  },

  // Level 3
  {
    across: {
      '1': { clue: 'Cat sound (purr)', answer: 'PURR', row: 0, col: 0 },
      '3': { clue: 'Ocean (sea)', answer: 'SEA', row: 2, col: 1 },
      '5': { clue: 'Flying pet (bat)', answer: 'BAT', row: 4, col: 0 },
    },
    down: {
      '1': { clue: 'Pour gently (purl)', answer: 'PURL', row: 0, col: 0 },
      '2': { clue: 'Body of water (sea)', answer: 'SEA', row: 0, col: 2 },
      '4': { clue: 'Flying mammal (bat)', answer: 'BAT', row: 1, col: 1 },
    },
  },
];