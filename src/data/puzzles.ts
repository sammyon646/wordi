// src/data/puzzles.ts
export interface Word {
  word: string
  hint: string
  row: number
  col: number
  direction: 'horizontal' | 'vertical'
}

export interface Puzzle {
  words: Word[]
  gridSize: number
}

export const puzzles: Puzzle[] = [
  {
    words: [
      { word: 'cat', hint: 'Cat', row: 1, col: 0, direction: 'horizontal' },
      { word: 'act', hint: 'Act', row: 0, col: 1, direction: 'vertical' },
      { word: 'taco', hint: 'Taco', row: 2, col: 1, direction: 'horizontal' },
    ],
    gridSize: 4
  },
  {
    words: [
      { word: 'sun', hint: 'Sun', row: 0, col: 1, direction: 'horizontal' },
      { word: 'nut', hint: 'Nut', row: 0, col: 1, direction: 'vertical' },
      { word: 'tea', hint: 'Tea', row: 2, col: 0, direction: 'horizontal' },
      { word: 'eat', hint: 'Eat', row: 1, col: 0, direction: 'vertical' },
    ],
    gridSize: 4
  },
  {
    words: [
      { word: 'love', hint: 'Love', row: 1, col: 0, direction: 'horizontal' },
      { word: 'oven', hint: 'Oven', row: 0, col: 1, direction: 'vertical' },
      { word: 'vole', hint: 'Vole', row: 1, col: 1, direction: 'vertical' },
    ],
    gridSize: 4
  },
  {
    words: [
      { word: 'dog', hint: 'Dog', row: 0, col: 1, direction: 'horizontal' },
      { word: 'god', hint: 'God', row: 0, col: 1, direction: 'vertical' },
      { word: 'go', hint: 'Go', row: 1, col: 1, direction: 'vertical' },
    ],
    gridSize: 3
  },
  // Добавляй сколько угодно — легко масштабируется!
]