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
  // Level 1 — CAT / CAR / TRY / RAT (без конфликтов)
  {
    across: {
      '1': { clue: 'Кот (англ.)', answer: 'CAT', row: 0, col: 0 },
      '3': { clue: 'Машина (англ.)', answer: 'CAR', row: 2, col: 0 },
    },
    down: {
      '2': { clue: 'Попробовать', answer: 'TRY', row: 0, col: 3 },
      '4': { clue: 'Крыса', answer: 'RAT', row: 1, col: 1 },
    },
  },

  // Level 2 — DOG / DAY / GOD / YES
  {
    across: {
      '1': { clue: 'Собака', answer: 'DOG', row: 1, col: 1 },
      '3': { clue: 'День', answer: 'DAY', row: 3, col: 0 },
    },
    down: {
      '2': { clue: 'Бог', answer: 'GOD', row: 0, col: 0 },
      '4': { clue: 'Да', answer: 'YES', row: 0, col: 3 },
    },
  },

  // Level 3 — BOOK / WOW / COW / BE / WE
  {
    across: {
      '1': { clue: 'Книга', answer: 'BOOK', row: 2, col: 0 },
      '4': { clue: 'Вау!', answer: 'WOW', row: 0, col: 4 },
    },
    down: {
      '2': { clue: 'Корова', answer: 'COW', row: 0, col: 2 },
      '3': { clue: 'Быть', answer: 'BE', row: 0, col: 6 },
      '5': { clue: 'Мы', answer: 'WE', row: 2, col: 4 },
    },
  },

  // Level 4 — LOVE / YET / LION / ONE / IN
  {
    across: {
      '1': { clue: 'Любовь', answer: 'LOVE', row: 0, col: 0 },
      '4': { clue: 'Ещё', answer: 'YET', row: 3, col: 1 },
    },
    down: {
      '2': { clue: 'Лев', answer: 'LION', row: 0, col: 3 },
      '3': { clue: 'Один', answer: 'ONE', row: 0, col: 1 },
      '5': { clue: 'В', answer: 'IN', row: 1, col: 2 },
    },
  },

  // Level 5 — SEA / EAT / TEA / GARDEN / EARTH / NET
  {
    across: {
      '1': { clue: 'Море', answer: 'SEA', row: 0, col: 2 },
      '3': { clue: 'Есть (кушать)', answer: 'EAT', row: 3, col: 0 },
      '5': { clue: 'Чай', answer: 'TEA', row: 3, col: 3 },
    },
    down: {
      '2': { clue: 'Сад', answer: 'GARDEN', row: 0, col: 5 },
      '4': { clue: 'Земля', answer: 'EARTH', row: 1, col: 2 },
      '6': { clue: 'Сеть', answer: 'NET', row: 0, col: 0 },
    },
  },

  // Level 6 — RIVER / GAME / DAISY / TIME / FISH
  {
    across: {
      '1': { clue: 'Река', answer: 'RIVER', row: 1, col: 0 },
      '4': { clue: 'Игра', answer: 'GAME', row: 0, col: 2 },
    },
    down: {
      '2': { clue: 'Ромашка', answer: 'DAISY', row: 0, col: 6 },
      '3': { clue: 'Время', answer: 'TIME', row: 0, col: 2 },
      '5': { clue: 'Рыба', answer: 'FISH', row: 1, col: 4 },
    },
  },

  // Level 7 — MUSIC / LIGHT / BALL / POWER / MOON / PLAY
  {
    across: {
      '1': { clue: 'Музыка', answer: 'MUSIC', row: 0, col: 0 },
      '4': { clue: 'Свет', answer: 'LIGHT', row: 2, col: 1 },
    },
    down: {
      '2': { clue: 'Мяч', answer: 'BALL', row: 0, col: 2 },
      '3': { clue: 'Сила', answer: 'POWER', row: 0, col: 5 },
      '5': { clue: 'Луна', answer: 'MOON', row: 1, col: 0 },
      '6': { clue: 'Играть', answer: 'PLAY', row: 1, col: 3 },
    },
  },

  // Level 8 — GREEN / FOREST / HILL / SKY / RIVER / TREE
  {
    across: {
      '1': { clue: 'Зелёный', answer: 'GREEN', row: 0, col: 1 },
      '4': { clue: 'Лес', answer: 'FOREST', row: 2, col: 0 },
    },
    down: {
      '2': { clue: 'Гора', answer: 'HILL', row: 0, col: 3 },
      '3': { clue: 'Небо', answer: 'SKY', row: 0, col: 6 },
      '5': { clue: 'Река', answer: 'RIVER', row: 1, col: 1 },
      '6': { clue: 'Дерево', answer: 'TREE', row: 1, col: 4 },
    },
  },

  // Level 9 — BIRD / SUN / HOME / FISH / TREE / MOON / STAR
  {
    across: {
      '1': { clue: 'Птица', answer: 'BIRD', row: 0, col: 1 },
      '3': { clue: 'Солнце', answer: 'SUN', row: 3, col: 0 },
      '6': { clue: 'Дом', answer: 'HOME', row: 3, col: 3 },
    },
    down: {
      '2': { clue: 'Рыба', answer: 'FISH', row: 0, col: 3 },
      '4': { clue: 'Дерево', answer: 'TREE', row: 1, col: 1 },
      '5': { clue: 'Луна', answer: 'MOON', row: 0, col: 0 },
      '7': { clue: 'Звезда', answer: 'STAR', row: 1, col: 5 },
    },
  },

  // Level 10 — TODO: нужен полный набор слов (across/down) и координаты
]