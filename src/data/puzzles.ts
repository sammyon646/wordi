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
  {
    across: {
      '1': { clue: 'Кот (англ.)', answer: 'CAT', row: 0, col: 0 },
    },
    down: {
      '2': { clue: 'Действовать (англ.)', answer: 'ACT', row: 0, col: 1 },
    },
  },
  {
    across: {
      '1': { clue: 'Десять (англ.)', answer: 'TEN', row: 1, col: 0 },
    },
    down: {
      '2': { clue: 'Сеть (англ.)', answer: 'NET', row: 0, col: 1 },
    },
  },
  {
    across: {
      '1': { clue: 'Выиграл (прош. время от win)', answer: 'WON', row: 0, col: 0 },
      '3': { clue: 'Сейчас (англ.)', answer: 'NOW', row: 2, col: 1 },
    },
    down: {
      '2': { clue: 'Владеть (англ.)', answer: 'OWN', row: 0, col: 1 },
    },
  },
]