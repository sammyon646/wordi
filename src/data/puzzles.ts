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
  // Level 1 — CAT / TEA / ACT, компактно, без конфликтов
  {
    across: {
      '1': { clue: 'Pet that meows', answer: 'CAT', row: 0, col: 1 },
      '3': { clue: 'Drink hot', answer: 'TEA', row: 2, col: 0 },
    },
    down: {
      '2': { clue: 'Not this', answer: 'ACT', row: 0, col: 0 }, // пересечение по C с CAT
    },
  },

  // Level 2 — DOG / LOG / LONG, есть пересечения, без конфликтов
  {
    across: {
      '1': { clue: 'Barks a lot', answer: 'DOG', row: 1, col: 1 },
      '3': { clue: 'Wood piece', answer: 'LOG', row: 3, col: 0 },
    },
    down: {
      '2': { clue: 'Not short', answer: 'LONG', row: 0, col: 2 }, // пересечение с DOG и LOG
    },
  },

  // Level 3 — BEAR / BARE / EAR / BEE, плотные пересечения
  {
    across: {
      '1': { clue: 'Wild animal', answer: 'BEAR', row: 1, col: 1 },
      '4': { clue: 'Naked', answer: 'BARE', row: 2, col: 1 },
    },
    down: {
      '2': { clue: 'Listen with', answer: 'EAR', row: 0, col: 3 }, // пересечение с BEAR/BARE
      '3': { clue: 'Honey lover', answer: 'BEE', row: 0, col: 0 },
    },
  },

  // Level 4 — HAT / HAPPY / HIT / PIE, плотная сетка
  {
    across: {
      '1': { clue: 'On your head', answer: 'HAT', row: 0, col: 1 },
      '4': { clue: 'Not sad', answer: 'HAPPY', row: 3, col: 0 },
    },
    down: {
      '2': { clue: 'Cut with', answer: 'HIT', row: 0, col: 1 }, // пересечение с HAT
      '3': { clue: 'Food circle', answer: 'PIE', row: 0, col: 3 },
    },
  },

  // Level 5 — RAIN / WEAR / WIN / EAR / WET, сложный, много пересечений
  {
    across: {
      '1': { clue: 'From the sky', answer: 'RAIN', row: 1, col: 1 },
      '4': { clue: 'Have on', answer: 'WEAR', row: 3, col: 0 },
      '5': { clue: 'Opposite of lose', answer: 'WIN', row: 0, col: 0 },
    },
    down: {
      '2': { clue: 'Listen organ', answer: 'EAR', row: 0, col: 2 }, // пересечение с RAIN
      '3': { clue: 'Not dry', answer: 'WET', row: 0, col: 5 },
    },
  },
]