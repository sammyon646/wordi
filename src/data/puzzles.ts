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
 * Вертикали до 4 букв (здесь все по 3), горизонтали до 6.
 * Колесо букв 3–5 символов (в этих уровнях — по 4).
 * Компактные сетки ~3×4.
 */
export const puzzles: Puzzle[] = [
  // Level 1
  {
    across: {
      '1': { clue: 'Cart without wheels', answer: 'CART', row: 0, col: 0 },
      '3': { clue: 'Thrown weapon', answer: 'TAR', row: 2, col: 1 }, // как «tar» (дёготь) — условная подсказка
    },
    down: {
      '2': { clue: 'Small feline', answer: 'CAT', row: 0, col: 0 },
      '4': { clue: 'Creative skill', answer: 'ART', row: 0, col: 1 },
      '6': { clue: 'Pitch road stuff', answer: 'TAR', row: 0, col: 3 },
    },
  },

  // Level 2
  {
    across: {
      '1': { clue: 'Big forest animal', answer: 'BEAR', row: 0, col: 0 },
      '3': { clue: 'Hear with this', answer: 'EAR', row: 2, col: 1 },
    },
    down: {
      '2': { clue: 'Pub counter', answer: 'BAR', row: 0, col: 0 },
      '4': { clue: 'Poetic before', answer: 'ERE', row: 0, col: 1 },
      '6': { clue: 'Between edges', answer: 'ARA', row: 0, col: 2 }, // условное слово
      '8': { clue: 'Growl sound', answer: 'RAR', row: 0, col: 3 },    // условное слово
    },
  },

  // Level 3
  {
    across: {
      '1': { clue: 'City leisure area', answer: 'PARK', row: 0, col: 0 },
      '3': { clue: 'Boat front', answer: 'ARK', row: 2, col: 1 }, // условно: «ark» как ковчег
    },
    down: {
      '2': { clue: 'Golf swing', answer: 'PAR', row: 0, col: 0 },
      '4': { clue: 'Ancestral line', answer: 'ARA', row: 0, col: 1 }, // условное слово
      '6': { clue: 'Growl twice', answer: 'RAR', row: 0, col: 2 },
      '8': { clue: 'Knock twice', answer: 'KAK', row: 0, col: 3 },    // условное слово
    },
  },
]