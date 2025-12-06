import { create } from 'zustand'
import { puzzles, type Puzzle } from '../data/puzzles'

type State = {
  wordPoints: number
  level: number
  currentPuzzle: Puzzle
  selectedCells: [number, number][]
  completedWords: Set<string>
  addWordPoints: (amount: number) => void
  setNewPuzzle: () => void
  selectCell: (row: number, col: number) => void
  completeWord: (word: string) => void
  levelUp: () => void
}

const useGameStore = create<State>((set, get) => ({
  wordPoints: 0,
  level: 1,
  currentPuzzle: puzzles[0],
  selectedCells: [],
  completedWords: new Set(),
  addWordPoints: (amount) => set({ wordPoints: get().wordPoints + amount }),
  setNewPuzzle: () => {
    const index = Math.floor(Math.random() * puzzles.length)
    set({ 
      currentPuzzle: puzzles[index], 
      selectedCells: [], 
      completedWords: new Set() 
    })
  },
  selectCell: (row, col) => {
    const cells = get().selectedCells
    const exists = cells.some(([r, c]) => r === row && c === col)
    set({ 
      selectedCells: exists 
        ? cells.filter(([r, c]) => !(r === row && c === col))
        : [...cells, [row, col]]
    })
  },
  completeWord: (word) => set({ 
    completedWords: new Set([...get().completedWords, word]) 
  }),
  levelUp: () => set({ level: get().level + 1 })
}))

export default useGameStore