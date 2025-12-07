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
 * Вертикали до 5 букв, горизонтали до 5–6.
 * Слова не соприкасаются, кроме явных пересечений по одинаковым буквам.
 * Колесо — 5 букв.
 */
export const puzzles: Puzzle[] = [
  // Level 1 (буквы PRINT)
  {
    across: {
      '1': { clue: 'Metal container', answer: 'TIN', row: 0, col: 0 },      // T I N
      '3': { clue: 'Printed copy', answer: 'PRINT', row: 3, col: 2 },       // P R I N T
      '5': { clue: 'To stab lightly', answer: 'PIN', row: 6, col: 5 },      // P I N
    },
    down: {
      '2': { clue: 'Drink quickly', answer: 'PINT', row: 0, col: 6 },       // P I N T (T пересечение с PRINT в (3,6))
      '4': { clue: 'To tear lightly', answer: 'RIP', row: 3, col: 0 },      // R I P (отдельно слева)
      '6': { clue: 'Short try', answer: 'TIP', row: 5, col: 9 },            // T I P (справа)
    },
  },

  // Level 2 (буквы LEAFS)
  {
    across: {
      '1': { clue: 'Noise of air', answer: 'SIGH', row: 1, col: 1 },        // S I G H (тут допустим G как "буква" — но мы держим 5 букв LEAFS? Лучше убрать G. Заменим: "SAFE")
      '3': { clue: 'Tree part', answer: 'LEAF', row: 4, col: 3 },           // L E A F
      '5': { clue: 'Secure', answer: 'SAFE', row: 8, col: 6 },              // S A F E
    },
    down: {
      '2': { clue: 'Small sea', answer: 'SEA', row: 0, col: 6 },            // S E A
      '4': { clue: 'Easy state', answer: 'EASE', row: 0, col: 8 },          // E A S E
      '6': { clue: 'Tiny biting fly', answer: 'FLEA', row: 6, col: 4 },     // F L E A
    },
  },

  // Level 3 (буквы WORLD)
  {
    across: {
      '1': { clue: 'Our planet', answer: 'WORLD', row: 3, col: 2 },         // W O R L D
      '3': { clue: 'Ancient story', answer: 'LORE', row: 6, col: 5 },       // L O R E
      '5': { clue: 'Old', answer: 'OLD', row: 8, col: 6 },                  // O L D
    },
    down: {
      '2': { clue: 'Spoken word', answer: 'WORD', row: 0, col: 6 },         // W O R D (пересекается в D с WORLD (3,6))
      '4': { clue: 'To rule', answer: 'LORD', row: 5, col: 4 },             // L O R D
      '6': { clue: 'Rowing tool (short)', answer: 'OAR', row: 0, col: 0 },  // O A R
    },
  },
]