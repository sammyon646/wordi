import { create } from 'zustand'

interface Word {
  word: string
  hint: string
  category: string
}

const words: Word[] = [
  { word: 'apple', hint: 'Apple', category: 'Fruit' },
  { word: 'banana', hint: 'Banana', category: 'Fruit' },
  { word: 'cat', hint: 'Cat', category: 'Animal' },
  { word: 'dog', hint: 'Dog', category: 'Animal' },
  { word: 'paris', hint: 'Paris', category: 'City' },
  { word: 'london', hint: 'London', category: 'City' },
  { word: 'coffee', hint: 'Coffee', category: 'Drink' },
  { word: 'pizza', hint: 'Pizza', category: 'Food' },
  { word: 'guitar', hint: 'Guitar', category: 'Instrument' },
  { word: 'mountain', hint: 'Mountain', category: 'Nature' },
  { word: 'river', hint: 'River', category: 'Nature' },
  { word: 'book', hint: 'Book', category: 'Object' },
  { word: 'computer', hint: 'Computer', category: 'Tech' },
  { word: 'phone', hint: 'Phone', category: 'Tech' },
  { word: 'love', hint: 'Love', category: 'Emotion' },
  { word: 'happy', hint: 'Happy', category: 'Emotion' },
  { word: 'car', hint: 'Car', category: 'Transport' },
  { word: 'bike', hint: 'Bike', category: 'Transport' },
  // Добавь сколько угодно слов
]

type State = {
  coins: number
  level: number
  currentWord: Word
  letters: string[]
  typedWord: string
  path: number[]
  addCoins: (amount: number) => void
  setNewWord: () => void
  updateTypedWord: (letter: string, index: number) => void
  resetPath: () => void
  levelUp: () => void
}

const useGameStore = create<State>((set, get) => ({
  coins: 0,
  level: 1,
  currentWord: words[0],
  letters: words[0].word.split('').sort(() => Math.random() - 0.5),
  typedWord: '',
  path: [],
  addCoins: (amount) => set({ coins: get().coins + amount }),
  setNewWord: () => {
    const index = Math.floor(Math.random() * words.length)
    const newWord = words[index]
    const newLetters = newWord.word.split('').sort(() => Math.random() - 0.5)
    set({ currentWord: newWord, letters: newLetters, typedWord: '', path: [] })
  },
  updateTypedWord: (letter, index) => {
    if (get().path.includes(index)) return
    const newPath = [...get().path, index]
    set({ typedWord: get().typedWord + letter, path: newPath })
  },
  resetPath: () => set({ typedWord: '', path: [] }),
  levelUp: () => set({ level: get().level + 1 })
}))

export default useGameStore