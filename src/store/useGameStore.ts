import { create } from 'zustand'

interface Word {
  word: string
  hint: string
}

const words: Word[] = [
  { word: 'apple', hint: 'Apple' },
  { word: 'banana', hint: 'Banana' },
  { word: 'cat', hint: 'Cat' },
  { word: 'dog', hint: 'Dog' },
  { word: 'paris', hint: 'Paris' },
  { word: 'london', hint: 'London' },
  { word: 'coffee', hint: 'Coffee' },
  { word: 'pizza', hint: 'Pizza' },
  { word: 'guitar', hint: 'Guitar' },
  { word: 'river', hint: 'River' },
  { word: 'book', hint: 'Book' },
  { word: 'phone', hint: 'Phone' },
  { word: 'sun', hint: 'Sun' },
  { word: 'love', hint: 'Love' },
  { word: 'car', hint: 'Car' },
  { word: 'bike', hint: 'Bike' },
  // Добавь сколько угодно — короткие слова!
]

type State = {
  wordPoints: number
  level: number
  currentWord: Word
  letters: string[]
  typedWord: string
  path: number[]
  addWordPoints: (amount: number) => void
  setNewWord: () => void
  updateTypedWord: (letter: string, index: number) => void
  resetPath: () => void
  levelUp: () => void
}

const useGameStore = create<State>((set, get) => ({
  wordPoints: 0,
  level: 1,
  currentWord: words[0],
  letters: words[0].word.split('').sort(() => Math.random() - 0.5),
  typedWord: '',
  path: [],
  addWordPoints: (amount) => set({ wordPoints: get().wordPoints + amount }),
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