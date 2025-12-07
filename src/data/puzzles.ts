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
 * Пересечения только по совпадающим буквам.
 * Level 1 — буквы FICTION, компактная сетка.
 */
export const puzzles: Puzzle[] = [
  // Level 1 — FICTION, FIT, NOT, TIN, ICON, INFO, FONT
  {
    across: {
      '1': { clue: 'Imaginary story', answer: 'FICTION', row: 3, col: 3 }, // F I C T I O N
      '3': { clue: 'Metal container', answer: 'TIN', row: 1, col: 9 },     // T I N
      '5': { clue: 'Text style', answer: 'FONT', row: 5, col: 0 },         // F O N T
    },
    down: {
      '2': { clue: 'Be suitable', answer: 'FIT', row: 0, col: 5 },         // N O T (пересечений нет)
      '4': { clue: 'Opposite of yes', answer: 'NOT', row: 0, col: 5 },     // N O T
      '6': { clue: 'Symbol', answer: 'ICON', row: 0, col: 8 },             // I C O N (N пересекается с FICTION в (3,8))
      '8': { clue: 'Information', answer: 'INFO', row: 1, col: 2 },        // I N F O
    },
  },

  // Level 2 — (пример) буквы BEAVER
  {
    across: {
      '1': { clue: 'Courageous', answer: 'BRAVE', row: 2, col: 1 },
      '3': { clue: 'Rodent builder', answer: 'BEAVER', row: 4, col: 0 },
      '5': { clue: 'No longer', answer: 'NEVER', row: 6, col: 3 },
    },
    down: {
      '2': { clue: 'At any time', answer: 'EVER', row: 0, col: 5 },
      '4': { clue: 'Wild animal', answer: 'BEAR', row: 1, col: 4 },
      '6': { clue: 'Face up to', answer: 'BRAVE', row: 1, col: 1 },
      '8': { clue: 'Adult male bear', answer: 'BRUIN', row: 0, col: 3 },
    },
  },
]