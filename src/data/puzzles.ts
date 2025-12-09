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
  // Level 1
  {
    across: {
      '1': { clue: 'Yellow fruit', answer: 'LEMON', row: 2, col: 0 },
      '4': { clue: 'You hear with it', answer: 'EAR', row: 0, col: 8 },
    },
    down: {
      '2': { clue: 'Twelve months', answer: 'YEAR', row: 0, col: 6 },
      '3': { clue: 'Not early', answer: 'LATE', row: 1, col: 10 },
    },
  },

  // Level 2
  {
    across: {
      '1': { clue: 'Big cat', answer: 'TIGER', row: 2, col: 0 },
      '4': { clue: 'Used to see', answer: 'EYE', row: 0, col: 8 },
    },
    down: {
      '2': { clue: 'Opposite of old', answer: 'NEW', row: 0, col: 6 },
      '3': { clue: 'Not begin', answer: 'END', row: 0, col: 12 },
    },
  },

  // Level 3
  {
    across: {
      '1': { clue: 'Animal that barks', answer: 'DOG', row: 2, col: 2 },
      '4': { clue: 'Opposite of yes', answer: 'NO', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Tree part', answer: 'LOG', row: 0, col: 4 }, // пересечение по G
      '3': { clue: 'You sit on it', answer: 'CHAIR', row: 0, col: 0 },
    },
  },

  // Level 4
  {
    across: {
      '1': { clue: 'Red fruit', answer: 'APPLE', row: 2, col: 0 },
      '5': { clue: 'Not down', answer: 'UP', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Father', answer: 'DAD', row: 0, col: 6 },
      '3': { clue: 'Come in', answer: 'ENTER', row: 0, col: 14 },
      '4': { clue: 'Season after summer', answer: 'FALL', row: 0, col: 5 },
    },
  },

  // Level 5
  {
    across: {
      '1': { clue: 'Drink from beans', answer: 'TEA', row: 2, col: 2 },
      '4': { clue: 'Green vegetable', answer: 'PEA', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Opposite of far', answer: 'NEAR', row: 0, col: 5 },
      '3': { clue: 'Not light', answer: 'DARK', row: 0, col: 0 },
    },
  },

  // Level 6
  {
    across: {
      '1': { clue: 'Color of grass', answer: 'GREEN', row: 2, col: 0 },
      '4': { clue: 'You write with it', answer: 'PEN', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Opposite of black', answer: 'WHITE', row: 0, col: 14 },
      '3': { clue: 'Animal with long neck', answer: 'GIRAFFE', row: 0, col: 6 },
    },
  },

  // Level 7
  {
    across: {
      '1': { clue: 'Used to call', answer: 'PHONE', row: 2, col: 0 },
      '4': { clue: 'Bird that hoots', answer: 'OWL', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Season', answer: 'SPRING', row: 0, col: 6 },
      '3': { clue: 'Not go', answer: 'STAY', row: 0, col: 14 },
    },
  },

  // Level 8
  {
    across: {
      '1': { clue: 'Sky color', answer: 'BLUE', row: 2, col: 0 },
      '4': { clue: 'Sweet food', answer: 'CAKE', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Rain + snow', answer: 'SLEET', row: 0, col: 4 },
      '3': { clue: 'Not strong', answer: 'WEAK', row: 0, col: 14 },
    },
  },

  // Level 9
  {
    across: {
      '1': { clue: 'Large animal', answer: 'BEAR', row: 2, col: 0 },
      '4': { clue: 'Used to eat soup', answer: 'SPOON', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Opposite of happy', answer: 'SAD', row: 0, col: 4 },
      '3': { clue: 'Time before now', answer: 'PAST', row: 0, col: 16 },
    },
  },

  // Level 10
  {
    across: {
      '1': { clue: 'Fast animal', answer: 'CHEETAH', row: 2, col: 0 },
      '5': { clue: 'Not slow', answer: 'FAST', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'You read it', answer: 'BOOK', row: 0, col: 8 },
      '3': { clue: 'Hot drink', answer: 'TEA', row: 0, col: 14 },
      '4': { clue: 'Opposite of cold', answer: 'HOT', row: 0, col: 6 }, // пересечение по H с CHEETAH
    },
  },

  // Level 11
  {
    across: {
      '1': { clue: 'School subject', answer: 'MATH', row: 2, col: 2 },
      '4': { clue: 'Animal that jumps', answer: 'FROG', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Not front', answer: 'BACK', row: 0, col: 0 },
      '3': { clue: 'Used to cut', answer: 'AXE', row: 0, col: 6 },
    },
  },

  // Level 12
  {
    across: {
      '1': { clue: 'Place to sleep', answer: 'BED', row: 2, col: 2 },
      '4': { clue: 'Not off', answer: 'ON', row: 0, col: 10 },
    },
    down: {
      '2': { clue: 'Opposite of good', answer: 'BAD', row: 0, col: 0 },
      '3': { clue: 'You live in it', answer: 'HOME', row: 0, col: 14 },
    },
  },
]