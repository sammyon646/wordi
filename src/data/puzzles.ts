export interface Entry { id: string; direction: 'across' | 'down'; clue: string; answer: string; row: number; col: number }
export interface Puzzle {
  across: Record<string, { clue: string; answer: string; row: number; col: number }>;
  down:   Record<string, { clue: string; answer: string; row: number; col: number }>;
}

export const puzzles: Puzzle[] = [
  // Level 1 — буквы REACT (5)
  {
    across: {
      '1': { clue: 'Act in response', answer: 'REACT', row: 2, col: 1 },   // R E A C T
      '3': { clue: 'Rate something',  answer: 'RATE',  row: 4, col: 0 },   // R A T E
    },
    down: {
      '2': { clue: 'Art skill',       answer: 'CRAFT', row: 0, col: 3 },   // C R A F T
      '4': { clue: 'Tea time?',       answer: 'TEA',   row: 0, col: 4 },   // T E A
    },
  },

  // Level 2 — буквы WORLD (5)
  {
    across: {
      '1': { clue: 'Our planet',  answer: 'WORLD', row: 2, col: 1 },       // W O R L D
      '3': { clue: 'Old',         answer: 'OLD',   row: 4, col: 3 },       // O L D
    },
    down: {
      '2': { clue: 'Ruler',       answer: 'LORD',  row: 0, col: 3 },       // L O R D
      '4': { clue: 'Rowing tool', answer: 'OAR',   row: 1, col: 1 },       // O A R
    },
  },

  // Level 3 — буквы LEAFS (5)
  {
    across: {
      '1': { clue: 'Tree part',   answer: 'LEAF',  row: 1, col: 1 },       // L E A F
      '3': { clue: 'Safe place',  answer: 'SAFE',  row: 3, col: 0 },       // S A F E
    },
    down: {
      '2': { clue: 'Not hard',    answer: 'EASY',  row: 0, col: 4 },       // E A S Y
      '4': { clue: 'Tiny bug',    answer: 'FLEA',  row: 0, col: 2 },       // F L E A
    },
  },
];