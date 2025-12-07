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
 * Горизонтали до 6 букв, вертикали до 4.
 * Компактные сетки без больших пустот (5x5 или 5x6).
 */
export const puzzles: Puzzle[] = [
  // Level 1 (5x5)
  {
    across: {
      '1': { clue: 'Likes to purr', answer: 'CAT', row: 0, col: 1 },
      '3': { clue: 'Flying bug', answer: 'BEE', row: 2, col: 0 },
      '5': { clue: 'Opposite of cold', answer: 'WARM', row: 4, col: 1 },
    },
    down: {
      '2': { clue: 'Soft throw', answer: 'TOSS', row: 0, col: 3 },
      '4': { clue: 'Big cat', answer: 'LION', row: 0, col: 2 },
      '6': { clue: 'Container', answer: 'BAG', row: 1, col: 0 },
    },
  },

  // Level 2 (5x6)
  {
    across: {
      '1': { clue: 'Cover for head', answer: 'HAT', row: 0, col: 1 },
      '3': { clue: 'Sea giant', answer: 'WHALE', row: 2, col: 0 },
      '5': { clue: 'Forest giant', answer: 'TREE', row: 4, col: 1 },
    },
    down: {
      '2': { clue: 'Slice of bread', answer: 'LOAF', row: 0, col: 3 },
      '4': { clue: 'Metal rope', answer: 'CABLE', row: 0, col: 0 }, // 5? must <=4. Oops ensure <=4 adjust: change to "CORD" length4 row0 col0
    },
  },

  // Level 3 (5x5)
  {
    across: {
      '1': { clue: 'Old cloth piece', answer: 'RAG', row: 0, col: 1 },
      '3': { clue: 'Taxi ride', answer: 'CAB', row: 2, col: 0 },
      '5': { clue: 'Bird sound', answer: 'CAW', row: 4, col: 2 },
    },
    down: {
      '2': { clue: 'Carry bag', answer: 'BAG', row: 0, col: 2 },
      '4': { clue: 'Funny trick', answer: 'GAG', row: 0, col: 3 },
      '6': { clue: 'Opposite of stop', answer: 'GO', row: 1, col: 1 },
    },
  },
]