import { create } from 'zustand'

interface Word {
  word: string
  hint: string
  category: string
}

const words: Word[] = [
  { word: 'apple', hint: '🍎', category: 'Fruit' },
  { word: 'banana', hint: '🍌', category: 'Fruit' },
  { word: 'cat', hint: '🐱', category: 'Animal' },
  { word: 'dog', hint: '🐶', category: 'Animal' },
  { word: 'paris', hint: '🗼', category: 'City' },
  { word: 'london', hint: '🏰', category: 'City' },
]

type State = {
  coins: number
  energy: number
  maxEnergy: number
  level: number
  currentWord: Word
  typedWord: string
  clicks: { id: number; x: number; y: number }[]
  addCoins: (amount: number) => void
  consumeEnergy: (amount: number) => void
  regenerateEnergy: () => void
  setNewWord: () => void
  updateTypedWord: (letter: string) => void
  setClicks: (clicks: { id: number; x: number; y: number }[]) => void
  levelUp: () => void
}

const useGameStore = create<State>((set, get) => ({
  coins: 0,
  energy: 1000,
  maxEnergy: 1000,
  level: 1,
  currentWord: words[0],
  typedWord: '',
  clicks: [],
  addCoins: (amount) => set({ coins: get().coins + amount }),
  consumeEnergy: (amount) => set({ energy: Math.max(0, get().energy - amount) }),
  regenerateEnergy: () => {
    const interval = setInterval(() => {
      set({ energy: Math.min(get().maxEnergy, get().energy + 1) })
    }, 100)
    return () => clearInterval(interval)
  },
  setNewWord: () => {
    const index = Math.floor(Math.random() * words.length)
    set({ currentWord: words[index], typedWord: '' })
    if (get().typedWord.length > 0) get().levelUp() // Уровень вверх при успехе
  },
  updateTypedWord: (letter) => set({ typedWord: get().typedWord + letter }),
  setClicks: (clicks) => set({ clicks }),
  levelUp: () => set({ level: get().level + 1, maxEnergy: get().maxEnergy + 100 })
}))

export default useGameStore