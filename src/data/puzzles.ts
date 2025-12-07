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
 * Простые слова (3–5 букв), каждый уровень 3–5 слов, единый связный кроссворд.
 * Между параллельными словами есть хотя бы одна пустая клетка, пересечения на одинаковых буквах.
 */
export const puzzles: Puzzle[] = [
  // Level 1
  {
    across: {
      '1': { clue: 'Cat sound animal', answer: 'CAT', row: 1, col: 1 },
      '3': { clue: 'Write with this', answer: 'PEN', row: 3, col: 3 },
    },
    down: {
      '2': { clue: 'Light hit', answer: 'TAP', row: 1, col: 3 },
      '4': { clue: "Opposite of can't", answer: 'CAN', row: 1, col: 1 },
    },
  },

  // Level 2
  {
    across: {
      '1': { clue: 'Bread piece', answer: 'PAN', row: 2, col: 2 },
      '3': { clue: 'Head cover', answer: 'HAT', row: 4, col: 2 },
    },
    down: {
      '2': { clue: 'Draw a simple plan', answer: 'MAP', row: 0, col: 2 },
      '4': { clue: 'Catch with holes', answer: 'NET', row: 2, col: 4 },
    },
  },

  // Level 3
  {
    across: {
      '1': { clue: 'Carry it', answer: 'BAG', row: 2, col: 2 },
      '3': { clue: 'Old cloth piece', answer: 'RAG', row: 4, col: 2 },
    },
    down: {
      '2': { clue: 'Taxi', answer: 'CAB', row: 0, col: 2 },
      '4': { clue: 'Repeat it playfully', answer: 'GAG', row: 2, col: 4 },
    },
  },
]