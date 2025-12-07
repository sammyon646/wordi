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
 * Каждая головоломка: 3–5 слов, единый связный кроссворд, ответы без повторяющихся букв.
 */
export const puzzles: Puzzle[] = [
  // Level 1 (4 слова, связаны все вместе)
  {
    across: {
      '1': { clue: 'Small vehicle with wheels', answer: 'CART', row: 1, col: 1 },
      '3': { clue: 'Torn or ripped', answer: 'TORN', row: 2, col: 0 },
    },
    down: {
      '2': { clue: 'Grain plant', answer: 'CORN', row: 1, col: 1 },
      '4': { clue: 'Mexican dish', answer: 'TACO', row: 1, col: 4 },
    },
  },

  // Level 2 (3 слова, все пересечены с главным словом)
  {
    across: {
      '1': { clue: 'Hard piece of rock', answer: 'STONE', row: 0, col: 0 },
    },
    down: {
      '2': { clue: 'Multiple ones', answer: 'ONES', row: 0, col: 2 },
      '3': { clue: 'Short letter', answer: 'NOTE', row: 0, col: 3 },
    },
  },

  // Level 3 (3 слова, общий набор букв)
  {
    across: {
      '1': { clue: 'Flat wooden board', answer: 'BOARD', row: 0, col: 0 },
    },
    down: {
      '2': { clue: 'Poet or minstrel', answer: 'BARD', row: 0, col: 0 },
      '3': { clue: 'Long street', answer: 'ROAD', row: 0, col: 3 },
    },
  },
]