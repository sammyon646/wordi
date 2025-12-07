// src/store/useGameStore.ts
import { create } from 'zustand'
import { puzzles } from '../data/puzzles'

type State = {
  wordPoints: number
  level: number
  currentPuzzleIndex: number
  isPuzzleCorrect: boolean
  addWordPoints: (amount: number) => void
  nextPuzzle: () => void
  levelUp: () => void
  setPuzzleCorrect: (correct: boolean) => void
  resetPuzzle: () => void
}

const useGameStore = create<State>((set, get) => ({
  wordPoints: 0,
  level: 1,
  currentPuzzleIndex: 0,
  isPuzzleCorrect: false,

  addWordPoints: (amount) => set({ wordPoints: get().wordPoints + amount }),

  nextPuzzle: () => {
    const next = get().currentPuzzleIndex + 1
    set({
      currentPuzzleIndex: next >= puzzles.length ? 0 : next,
      isPuzzleCorrect: false,
    })
  },

  levelUp: () => set((state) => ({ level: state.level + 1 })),

  setPuzzleCorrect: (correct) => set({ isPuzzleCorrect: correct }),

  resetPuzzle: () => set({ isPuzzleCorrect: false }),
}))

export default useGameStore