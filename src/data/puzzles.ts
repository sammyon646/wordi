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
 * Компактные сетки (до 6–7 строк), пересечения только по совпадающим буквам.
 * Колесо — 5 букв.
 */
export const puzzles: Puzzle[] = [
  // Level 1 — буквы PRINT
  {
    across: {
      '1': { clue: 'Short try', answer: 'TIP', row: 0, col: 1 },
      '3': { clue: 'Printed copy', answer: 'PRINT', row: 2, col: 0 },
      '5': { clue: 'Metal container', answer: 'TIN', row: 4, col: 4 },
    },
    down: {
      '2': { clue: 'To tear lightly', answer: 'RIP', row: 0, col: 3 },
      '4': { clue: 'Drink quickly', answer: 'PINT', row: 1, col: 5 }, // пересечение T с TIN в (4,5)
      '6': { clue: 'To stab lightly', answer: 'PIN', row: 1, col: 0 }, // пересечение P с PRINT (2,0)
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
      '2': { clue: 'Small sea', answer: 'SEA', row: 0, col: 4 },  // пересечение A с SAFE (2,3)
      '4': { clue: 'Tiny biting fly', answer: 'FLEA', row: 0, col: 2 }, // пересечение LEAF
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
      '2': { clue: 'Spoken word', answer: 'WORD', row: 0, col: 1 }, // пересечение с WORLD
      '4': { clue: 'To rule', answer: 'LORD', row: 1, col: 4 },     // пересечение R с WORLD (0,4)
      '6': { clue: 'Rowing tool (short)', answer: 'OAR', row: 0, col: 6 },
    },
  },
]