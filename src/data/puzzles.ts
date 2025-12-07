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
 * Компактные уровни, без пересечений на разных буквах.
 * 3–5 слов на уровень.
 */
export const puzzles: Puzzle[] = [
  // Level 1 — буквы C A T R N (3 слова)
  {
    across: {
      '1': { clue: 'Drive a vehicle', answer: 'CAR', row: 1, col: 1 },
      '3': { clue: 'Get sun on skin', answer: 'TAN', row: 2, col: 2 },
    },
    down: {
      '2': { clue: 'Pet with whiskers', answer: 'CAT', row: 0, col: 2 },
    },
  },

  // Level 2 — буквы B E A R V (4 слова) — валидные пересечения
  {
    across: {
      '1': { clue: 'Animal with fur', answer: 'BEAR', row: 1, col: 1 },
      '3': { clue: 'Courageous', answer: 'BRAVE', row: 3, col: 0 },
    },
    down: {
      '2': { clue: 'Organ of hearing', answer: 'EAR', row: 0, col: 2 },
      '4': { clue: 'Pub counter', answer: 'BAR', row: 0, col: 0 },
    },
  },

  // Level 3 — буквы D O G L W (3 слова) — валидные пересечения
  {
    across: {
      '1': { clue: 'Pet that barks', answer: 'DOG', row: 1, col: 1 },
    },
    down: {
      '2': { clue: 'Tree trunk', answer: 'LOG', row: 0, col: 2 }, // пересекается по O
      '4': { clue: 'Nocturnal bird', answer: 'OWL', row: 0, col: 0 }, // без конфликта
    },
  },
]