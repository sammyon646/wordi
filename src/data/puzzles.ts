export interface Entry {
  id: string
  direction: 'across' | 'down'
  clue: string
  answer: string
  row: number
  col: number
}

export interface Puzzle {
  across: Record<string, { clue: string; answer: string; row: number; col: number }>
  down: Record<string, { clue: string; answer: string; row: number; col: number }>
}

/**
 * Компактные сетки. Пересечения только по совпадающим буквам.
 * Колесо — 5 букв (PRINT).
 */
export const puzzles: Puzzle[] = [
  // Level 1 — буквы PRINT
  {
    across: {
      '1': { clue: 'Printed copy', answer: 'PRINT', row: 2, col: 1 }, // P R I N T (2,1..5)
      '3': { clue: 'Metal container', answer: 'TIN', row: 4, col: 4 }, // T I N (4,4..6)
    },
    down: {
      '2': { clue: 'To tear lightly', answer: 'RIP', row: 0, col: 1 }, // R I P (0..2,1) пересечение с PRINT в (2,1)=P
      '4': { clue: 'Drink quickly', answer: 'PINT', row: 0, col: 4 }, // P I N T (0..3,4) пересечение с PRINT в (2,4)=N
      '6': { clue: 'To stab lightly', answer: 'PIN', row: 2, col: 6 }, // P I N (2..4,6) пересечение с TIN в (4,6)=N
    },
  },

  // Level 2 — буквы LEAFS
  {
    across: {
      '1': { clue: 'Tree part', answer: 'LEAF', row: 0, col: 2 },
      '3': { clue: 'Secure', answer: 'SAFE', row: 2, col: 0 },
      '5': { clue: 'Cozy', answer: 'EASE', row: 4, col: 3 },
    },
    down: {
      '2': { clue: 'Small sea', answer: 'SEA', row: 0, col: 4 },
      '4': { clue: 'Tiny biting fly', answer: 'FLEA', row: 0, col: 2 },
      '6': { clue: 'Not hard', answer: 'EASY', row: 1, col: 6 },
    },
  },

  // Level 3 — буквы WORLD
  {
    across: {
      '1': { clue: 'Our planet', answer: 'WORLD', row: 0, col: 1 },
      '3': { clue: 'Ancient story', answer: 'LORE', row: 2, col: 3 },
      '5': { clue: 'Old', answer: 'OLD', row: 4, col: 5 },
    },
    down: {
      '2': { clue: 'Spoken word', answer: 'WORD', row: 0, col: 1 },
      '4': { clue: 'To rule', answer: 'LORD', row: 1, col: 4 },
      '6': { clue: 'Rowing tool (short)', answer: 'OAR', row: 0, col: 6 },
    },
  },
]