import { create } from 'zustand'
import { puzzles, Puzzle } from '../data/puzzles'

type EntryRef = {
  id: string
  direction: 'across' | 'down'
  clue: string
  answer: string
  row: number
  col: number
}

type State = {
  coins: number
  level: number
  puzzleIndex: number
  puzzle: Puzzle
  entries: EntryRef[]
  solved: Record<string, boolean>
  gridLetters: Record<string, string>
  letters: string[]
  typedWord: string
  path: number[]
  addCoins: (amount: number) => void
  setNewPuzzle: () => void
  updateTypedWord: (letter: string, index: number) => void
  resetPath: () => void
  trySolveTypedWord: () => { solved: boolean; allSolved: boolean }
}

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const buildEntries = (puzzle: Puzzle): EntryRef[] => {
  const list: EntryRef[] = []
  Object.entries(puzzle.across).forEach(([id, val]) => {
    list.push({ id, direction: 'across', ...val })
  })
  Object.entries(puzzle.down).forEach(([id, val]) => {
    list.push({ id, direction: 'down', ...val })
  })
  return list
}

// Дубликаты букв добавляем столько раз, сколько нужно
const buildLettersFromPuzzle = (entries: EntryRef[]) => {
  const maxCount: Record<string, number> = {}
  entries.forEach((e) => {
    const freq: Record<string, number> = {}
    e.answer
      .toUpperCase()
      .split('')
      .forEach((ch) => {
        freq[ch] = (freq[ch] || 0) + 1
        maxCount[ch] = Math.max(maxCount[ch] || 0, freq[ch])
      })
  })
  const letters: string[] = []
  Object.entries(maxCount).forEach(([ch, count]) => {
    for (let i = 0; i < count; i++) letters.push(ch)
  })
  return shuffle(letters)
}

const buildGridFromSolved = (entries: EntryRef[], solved: Record<string, boolean>) => {
  const grid: Record<string, string> = {}
  entries.forEach((entry) => {
    if (!solved[`${entry.direction}-${entry.id}`]) return
    entry.answer.split('').forEach((ch, idx) => {
      const r = entry.direction === 'across' ? entry.row : entry.row + idx
      const c = entry.direction === 'across' ? entry.col + idx : entry.col
      grid[`${r}-${c}`] = ch
    })
  })
  return grid
}

const useGameStore = create<State>((set, get) => ({
  coins: 0,
  level: 1,
  puzzleIndex: 0,
  puzzle: puzzles[0],
  entries: buildEntries(puzzles[0]),
  solved: {},
  gridLetters: {},
  letters: buildLettersFromPuzzle(buildEntries(puzzles[0])),
  typedWord: '',
  path: [],

  addCoins: (amount) => set({ coins: get().coins + amount }),

  setNewPuzzle: () => {
    const nextIndex = (get().puzzleIndex + 1) % puzzles.length
    const puzzle = puzzles[nextIndex]
    const entries = buildEntries(puzzle)
    set({
      puzzleIndex: nextIndex,
      puzzle,
      entries,
      solved: {},
      gridLetters: {},
      letters: buildLettersFromPuzzle(entries),
      typedWord: '',
      path: [],
    })
  },

  updateTypedWord: (letter, index) => {
    if (get().path.includes(index)) return
    const newPath = [...get().path, index]
    set({ typedWord: get().typedWord + letter, path: newPath })
  },

  resetPath: () => set({ typedWord: '', path: [] }),

  trySolveTypedWord: () => {
    const upper = get().typedWord.toUpperCase()
    const entries = get().entries
    const solved = { ...get().solved }

    const target = entries.find(
      (e) => !solved[`${e.direction}-${e.id}`] && e.answer.toUpperCase() === upper
    )

    if (!target) {
      set({ typedWord: '', path: [] })
      return { solved: false, allSolved: false }
    }

    solved[`${target.direction}-${target.id}`] = true
    const gridLetters = buildGridFromSolved(entries, solved)
    set({
      solved,
      gridLetters,
      typedWord: '',
      path: [],
      coins: get().coins + 50 * get().level, // монеты только за решённое слово
    })

    const allSolved = Object.keys(solved).length === entries.length
    if (allSolved) {
      set({ level: get().level + 1 })
    }
    return { solved: true, allSolved }
  },
}))

export default useGameStore