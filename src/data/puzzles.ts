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
  // Level 1 — буквы C A T R, пересечение CAR×CAT
  {
    across: {
      '1': { clue: 'Pet that purrs', answer: 'CAT', row: 1, col: 2 },
      '3': { clue: 'Painting or music', answer: 'ART', row: 3, col: 0 },
    },
    down: {
      '2': { clue: 'Red + yellow = ?', answer: 'CAR', row: 0, col: 3 }, // пересечение в A (row1,col3)
    },
  },

  // Level 2 — буквы D O G L F W A, пересечение FOG×DOG
  {
    across: {
      '1': { clue: 'Best friend of man', answer: 'DOG', row: 2, col: 2 },
      '4': { clue: 'Wood from tree', answer: 'LOG', row: 0, col: 8 },
    },
    down: {
      '2': { clue: 'Thick cloud on ground', answer: 'FOG', row: 0, col: 4 }, // пересечение в G (row2,col4)
      '3': { clue: 'What dogs do with tail', answer: 'WAG', row: 0, col: 6 },
    },
  },

  // Level 3 — буквы B A T E D (и др.), пересечения EAT×BAT и BET×BAT
  {
    across: {
      '1': { clue: 'Vampire animal', answer: 'BAT', row: 2, col: 4 },
      '4': { clue: 'Place for sleeping', answer: 'BED', row: 4, col: 0 },
    },
    down: {
      '2': { clue: 'Have food', answer: 'EAT', row: 0, col: 5 }, // пересечение в A (row2,col5)
      '3': { clue: 'Not good', answer: 'BAD', row: 0, col: 0 },
      '5': { clue: 'Wager', answer: 'BET', row: 0, col: 4 }, // пересечение в B (row2,col4)
    },
  },

  // Level 4 — буквы S U N F R (и др.), пересечение SON×SUN
  {
    across: {
      '1': { clue: 'Bright thing in sky', answer: 'SUN', row: 1, col: 2 },
      '4': { clue: 'Have a good time', answer: 'FUN', row: 3, col: 0 },
      '5': { clue: 'Move fast on foot', answer: 'RUN', row: 0, col: 8 },
    },
    down: {
      '2': { clue: 'Male child', answer: 'SON', row: 0, col: 2 }, // пересечение в S (row1,col2)
      '3': { clue: 'Opposite of off', answer: 'ON', row: 2, col: 6 },
    },
  },

  // Level 5 — буквы R A I N W E T (и др.), пересечения EAR×RAIN и IN×RAIN
  {
    across: {
      '1': { clue: 'Water from clouds', answer: 'RAIN', row: 2, col: 0 },
      '4': { clue: 'Opposite of lose', answer: 'WIN', row: 0, col: 8 },
      '6': { clue: 'Put on clothes', answer: 'WEAR', row: 4, col: 2 },
    },
    down: {
      '2': { clue: 'Organ for hearing', answer: 'EAR', row: 0, col: 0 }, // пересечение в R (row2,col0)
      '3': { clue: 'Not out', answer: 'IN', row: 1, col: 3 }, // пересечение в N (row2,col3)
      '5': { clue: 'Not dry', answer: 'WET', row: 0, col: 5 },
    },
  },
]