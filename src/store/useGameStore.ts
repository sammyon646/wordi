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
  { word: 'coffee', hint: '☕', category: 'Drink' },
  { word: 'pizza', hint: '🍕', category: 'Food' },
  { word: 'guitar', hint: '🎸', category: 'Instrument' },
  { word: 'mountain', hint: '🏔️', category: 'Nature' },
  { word: 'river', hint: '🏞️', category: 'Nature' },
  { word: 'book', hint: '📖', category: 'Object' },
  { word: 'computer', hint: '💻', category: 'Tech' },
  { word: 'phone', hint: '📱', category: 'Tech' },
  { word: 'sun', hint: '☀️', category: 'Weather' },
  { word: 'rain', hint: '🌧️', category: 'Weather' },
  { word: 'love', hint: '❤️', category: 'Emotion' },
  { word: 'happy', hint: '😊', category: 'Emotion' },
  { word: 'car', hint: '🚗', category: 'Transport' },
  { word: 'bike', hint: '🚲', category: 'Transport' },
  // Добавь 3000+ слов здесь. Можно загрузить из JSON: fetch('/assets/words.json').then(res => res.json())
]

type State = {
  coins: number
  energy: number
  maxEnergy: number
  level: number
  currentWord: Word
  typedWord: string
  path: number[] // Индексы букв в пути swipe
  addCoins: (amount: number) => void
  consumeEnergy: (amount: number) => void
  regenerateEnergy: () => void
  setNewWord: () => void
  updateTypedWord: (letter: string, index: number) => void
  resetPath: () => void
  levelUp: () => void
}

const useGameStore = create<State>((set, get) => ({
  coins: 0,
  energy: 1000,
  maxEnergy: 1000,
  level: 1,
  currentWord: words[0],
  typedWord: '',
  path: [],
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
    set({ currentWord: words[index], typedWord: '', path: [] })
  },
  updateTypedWord: (letter, index) => {
    const newPath = [...get().path, index]
    set({ typedWord: get().typedWord + letter, path: newPath })
  },
  resetPath: () => set({ typedWord: '', path: [] }),
  levelUp: () => set({ level: get().level + 1, maxEnergy: get().maxEnergy + 200 })
}))

export default useGameStore