import { create } from 'zustand'
import { puzzles, Puzzle } from '../data/puzzles'
import { ThemeId, WallpaperId } from '../data/cosmetics'

export type EntryRef = {
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
  selectedTheme: ThemeId
  selectedWallpaper: WallpaperId
  unlockedThemes: ThemeId[]
  unlockedWallpapers: WallpaperId[]
  addCoins: (amount: number) => void
  setNewPuzzle: () => void
  updateTypedWord: (letter: string, index: number) => void
  resetPath: () => void
  trySolveTypedWord: () => { solved: boolean; allSolved: boolean }
  hydrateFromServer: (data: {
    coins: number
    level: number
    puzzleIndex: number
    solved: Record<string, boolean>
    selectedTheme?: ThemeId
    selectedWallpaper?: WallpaperId
    unlockedThemes?: ThemeId[]
    unlockedWallpapers?: WallpaperId[]
  }) => void
  selectTheme: (id: ThemeId) => void
  selectWallpaper: (id: WallpaperId) => void
  buyTheme: (id: ThemeId, price: number) => boolean
  buyWallpaper: (id: WallpaperId, price: number) => boolean
}

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const buildEntries = (puzzle: Puzzle): EntryRef[] => {
  const list: EntryRef[] = []
  Object.entries(puzzle.across).forEach(([id, val]) => {
    list.push({ id, direction: 'across', ...val })
  })
  Object.entries(puzzle.down).forEach(([id, val]) => {
    list.push({ id, direction: 'down', ...val })
  })
  return list
}

export const validateEntries = (entries: EntryRef[]) => {
  const cellMap: Record<string, string> = {}
  const conflicts: string[] = []
  entries.forEach((entry) => {
    entry.answer
      .toUpperCase()
      .split('')
      .forEach((ch, idx) => {
        const r = entry.direction === 'across' ? entry.row : entry.row + idx
        const c = entry.direction === 'across' ? entry.col + idx : entry.col
        const key = `${r}-${c}`
        if (cellMap[key] && cellMap[key] !== ch) {
          conflicts.push(`Conflict at ${key}: ${cellMap[key]} vs ${ch}`)
        } else {
          cellMap[key] = ch
        }
      })
  })
  if (conflicts.length) {
    console.error('Puzzle conflicts:', conflicts)
    return false
  }
  return true
}

export const buildLettersFromPuzzle = (entries: EntryRef[]) => {
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

export const buildGridFromSolved = (entries: EntryRef[], solved: Record<string, boolean>) => {
  const grid: Record<string, string> = {}
  entries.forEach((entry) => {
    if (!solved[`${entry.direction}-${entry.id}`]) return
    entry.answer.split('').forEach((ch, idx) => {
      const r = entry.direction === 'across' ? entry.row : entry.row + idx
      const c = entry.direction === 'across' ? entry.col + idx : entry.col
      const key = `${r}-${c}`
      if (grid[key] && grid[key] !== ch) {
        console.warn(`Grid mismatch at ${key}: have ${grid[key]}, new ${ch}`)
        return
      }
      grid[key] = ch
    })
  })
  return grid
}

const initPuzzleIndex = 0
const initEntries = buildEntries(puzzles[initPuzzleIndex])
validateEntries(initEntries)

const useGameStore = create<State>((set, get) => ({
  coins: 0,
  level: 1,
  puzzleIndex: initPuzzleIndex,
  puzzle: puzzles[initPuzzleIndex],
  entries: initEntries,
  solved: {},
  gridLetters: {},
  letters: buildLettersFromPuzzle(initEntries),
  typedWord: '',
  path: [],
  selectedTheme: 'purple',
  selectedWallpaper: 'wave',
  unlockedThemes: ['purple'],
  unlockedWallpapers: ['wave'],

  addCoins: (amount) => set({ coins: get().coins + amount }),

  setNewPuzzle: () => {
    let attempts = puzzles.length
    let nextIndex = get().puzzleIndex
    while (attempts > 0) {
      nextIndex = (nextIndex + 1) % puzzles.length
      const puzzle = puzzles[nextIndex]
      const entries = buildEntries(puzzle)
      if (validateEntries(entries)) {
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
        return
      }
      attempts--
    }
    console.error('No valid puzzle layout found')
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
      coins: get().coins + 25,
    })

    const allSolved = Object.keys(solved).length === entries.length
    if (allSolved) {
      set({ level: get().level + 1 })
    }
    return { solved: true, allSolved }
  },

  hydrateFromServer: ({
    coins,
    level,
    puzzleIndex,
    solved,
    selectedTheme,
    selectedWallpaper,
    unlockedThemes,
    unlockedWallpapers,
  }) => {
    const puzzle = puzzles[puzzleIndex]
    const entries = buildEntries(puzzle)
    set({
      coins,
      level,
      puzzleIndex,
      puzzle,
      entries,
      solved,
      gridLetters: buildGridFromSolved(entries, solved),
      letters: buildLettersFromPuzzle(entries),
      typedWord: '',
      path: [],
      selectedTheme: selectedTheme || 'purple',
      selectedWallpaper: selectedWallpaper || 'wave',
      unlockedThemes: unlockedThemes || ['purple'],
      unlockedWallpapers: unlockedWallpapers || ['wave'],
    })
  },

  selectTheme: (id) => set({ selectedTheme: id }),
  selectWallpaper: (id) => set({ selectedWallpaper: id }),

  buyTheme: (id, price) => {
    const state = get()
    if (state.unlockedThemes.includes(id)) return true
    if (state.coins < price) return false
    set({
      coins: state.coins - price,
      unlockedThemes: [...state.unlockedThemes, id],
      selectedTheme: id,
    })
    return true
  },

  buyWallpaper: (id, price) => {
    const state = get()
    if (state.unlockedWallpapers.includes(id)) return true
    if (state.coins < price) return false
    set({
      coins: state.coins - price,
      unlockedWallpapers: [...state.unlockedWallpapers, id],
      selectedWallpaper: id,
    })
    return true
  },
}))

export default useGameStore