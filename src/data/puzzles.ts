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
 * Пересечения только по совпадающим буквам. Колесо из букв берётся из всех слов пазла.
 */
export const puzzles: Puzzle[] = [
  // Level 1 — буквы FICTION (6 букв)
  {
    across: {
      // INFO — строка 1, столбцы 1..4
      '1': { clue: 'Information', answer: 'INFO', row: 1, col: 1 },
      // FICTION — строка 4, столбцы 2..8
      '3': { clue: 'Imaginary story', answer: 'FICTION', row: 4, col: 2 },
      // TIN — строка 6, столбцы 5..7
      '5': { clue: 'Metal container', answer: 'TIN', row: 6, col: 5 },
    },
    down: {
      // FIT — столбец 2, строки 4..6 (пересекается с F в FICTION на (4,2))
      '2': { clue: 'Be suitable', answer: 'FIT', row: 4, col: 2 },
      // NOT — столбец 5, строки 2..4 (пересекается с T в FICTION на (4,5))
      '4': { clue: 'Opposite of yes', answer: 'NOT', row: 2, col: 5 },
      // ICON — столбец 8, строки 1..4 (пересекается с N в FICTION на (4,8))
      '6': { clue: 'Symbol', answer: 'ICON', row: 1, col: 8 },
      // FONT — столбец 4, строки 0..3
      '8': { clue: 'Text style', answer: 'FONT', row: 0, col: 4 },
    },
  },

  // Level 2 — буквы BEAVER (6 букв)
  {
    across: {
      '1': { clue: 'Courageous', answer: 'BRAVE', row: 2, col: 1 },
      '3': { clue: 'Rodent builder', answer: 'BEAVER', row: 4, col: 0 },
      '5': { clue: 'No longer', answer: 'NEVER', row: 6, col: 3 },
    },
    down: {
      '2': { clue: 'Adult male bear', answer: 'BRUIN', row: 0, col: 3 }, // пример короткого слова; можно заменить
      '4': { clue: 'At any time', answer: 'EVER', row: 0, col: 5 },
      '6': { clue: 'Face up to', answer: 'BRAVE', row: 1, col: 1 }, // пересекается по нескольким буквам
      '8': { clue: 'Wild animal', answer: 'BEAR', row: 1, col: 4 },
    },
  },
]