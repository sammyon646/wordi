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

export const puzzles: Puzzle[] = [
  // Level 1 — буквы CLOVE (5)
  {
    across: {
      '1': { clue: 'Garlic part', answer: 'CLOVE', row: 1, col: 1 }, // C L O V E
      '3': { clue: 'Wild canine', answer: 'WOLF', row: 3, col: 3 },  // W O L F
    },
    down: {
      '2': { clue: 'Opposite of up', answer: 'LOW', row: 0, col: 3 },   // L O W (пересечение O с CLOVE)
      '4': { clue: 'Affection', answer: 'LOVE', row: 1, col: 2 },       // L O V E (пересечение с CLOVE)
    },
  },

  // Level 2 — буквы GRAPE (5)
  {
    across: {
      '1': { clue: 'Fruit bunch', answer: 'GRAPE', row: 1, col: 1 }, // G R A P E
      '3': { clue: 'To tear', answer: 'RIP', row: 3, col: 2 },       // R I P
    },
    down: {
      '2': { clue: 'Big bird', answer: 'EMU', row: 0, col: 4 },     // E M U
      '4': { clue: 'Perch', answer: 'ROOST', row: 0, col: 2 },      // R O O S T (пересечение R с GRAPE)
    },
  },

  // Level 3 — буквы STEAM (5)
  {
    across: {
      '1': { clue: 'Hot vapor', answer: 'STEAM', row: 1, col: 1 },  // S T E A M
      '3': { clue: 'Consume', answer: 'EAT', row: 3, col: 2 },      // E A T
    },
    down: {
      '2': { clue: 'Math symbol', answer: 'SUM', row: 0, col: 1 },  // S U M (пересечение с STEAM)
      '4': { clue: 'Mother (short)', answer: 'MA', row: 1, col: 4 },// M A
    },
  },
]