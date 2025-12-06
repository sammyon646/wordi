import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Trophy, Users, DollarSign, Settings, X, Lightbulb } from 'lucide-react'
import canvasConfetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'

export default function App() {
  const { t, i18n } = useTranslation()
  const { wordPoints, level, currentPuzzle, selectedCells, completedWords, addWordPoints, setNewPuzzle, selectCell, completeWord, levelUp } = useGameStore()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const gridSize = currentPuzzle.gridSize

  // Создаём сетку
  const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''))

  currentPuzzle.words.forEach(w => {
    for (let i = 0; i < w.word.length; i++) {
      const row = w.direction === 'horizontal' ? w.row : w.row + i
      const col = w.direction === 'horizontal' ? w.col + i : w.col
      if (row < gridSize && col < gridSize) {
        grid[row][col] = w.word[i].toUpperCase()
      }
    }
  })

  // Проверка слова
  useEffect(() => {
    if (selectedCells.length < 2) return

    const sorted = selectedCells.slice().sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0])
    const word = sorted.map(([r, c]) => grid[r][c]).join('')

    const matched = currentPuzzle.words.find(w => 
      w.word.toUpperCase() === word || w.word.toUpperCase() === word.split('').reverse().join('')
    )

    if (matched && !completedWords.has(matched.word)) {
      addWordPoints(100 + level * 30)
      completeWord(matched.word)
      canvasConfetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } })

      if (completedWords.size + 1 === currentPuzzle.words.length) {
        setShowLevelUp(true)
        setTimeout(() => {
          setShowLevelUp(false)
          levelUp()
          setNewPuzzle()
        }, 2000)
      }
    }
  }, [selectedCells])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black text-white flex flex-col">
      {/* Шапка */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-yellow-400">{wordPoints}</div>
          <span className="text-sm opacity-80">points</span>
        </div>

        <button onClick={() => setShowHint(true)} className="bg-purple-700/50 px-4 py-2 rounded-full flex items-center gap-2">
          <Lightbulb className="w-6 h-6" /> Hint
        </button>

        <div className="flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-400" />
          <span className="text-xl font-bold">Lv {level}</span>
        </div>
      </div>

      {/* Кроссворд — всегда в одну строку */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div 
          className="grid gap-3"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, minmax(60px, 1fr))`,
            maxWidth: '90vw',
            aspectRatio: '1 / 1'
          }}
        >
          {grid.flat().map((letter, i) => {
            const row = Math.floor(i / gridSize)
            const col = i % gridSize
            const isSelected = selectedCells.some(([r, c]) => r === row && c === col)
            const isCompleted = currentPuzzle.words.some(w => 
              completedWords.has(w.word) &&
              ((w.direction === 'horizontal' && w.row === row && col >= w.col && col < w.col + w.word.length) ||
               (w.direction === 'vertical' && w.col === col && row >= w.row && row < w.row + w.word.length))
            )

            return (
              <motion.div
                key={i}
                className={`rounded-xl flex items-center justify-center text-3xl md:text-4xl font-bold shadow-lg transition-all ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isSelected ? 'bg-yellow-400 text-black scale-110' :
                  letter ? 'bg-purple-700 text-white' : 'bg-purple-900/30 border-2 border-purple-600'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.02, type: "spring", stiffness: 300 }}
                onClick={() => selectCell(row, col)}
              >
                {letter || ''}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Подсказка */}
      <AnimatePresence>
        {showHint && (
          <motion.div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setShowHint(false)}>
            <motion.div className="bg-purple-900 rounded-3xl p-12 text-center" onClick={e => e.stopPropagation()}>
              <div className="text-9xl mb-6">
                {currentPuzzle.words.find(w => !completedWords.has(w.word))?.hint || 'All done!'}
              </div>
              <button onClick={() => setShowHint(false)} className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-bold">
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up — по центру */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <motion.div
              className="text-8xl md:text-9xl font-bold text-yellow-400 drop-shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.3, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ duration: 1.6, type: "spring", stiffness: 200 }}
            >
              Level Up!
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Нижнее меню */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 flex justify-around py-4">
        <button className="flex flex-col items-center text-white"><Trophy className="w-7 h-7 mb-1" /><span className="text-xs">{t('boost')}</span></button>
        <button className="flex flex-col items-center text-white"><Users className="w-7 h-7 mb-1" /><span className="text-xs">{t('friends')}</span></button>
        <button className="flex flex-col items-center text-white"><DollarSign className="w-7 h-7 mb-1" /><span className="text-xs">{t('earn')}</span></button>
        <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center text-white"><Settings className="w-7 h-7 mb-1" /><span className="text-xs">{t('settings')}</span></button>
      </div>

      {/* Настройки */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setIsSettingsOpen(false)}>
            <motion.div className="bg-purple-900 rounded-2xl p-8" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">{t('settings')}</h2><button onClick={() => setIsSettingsOpen(false)}><X className="w-6 h-1" /></button></div>
              <div className="flex justify-center gap-6">
                <button onClick={() => { i18n.changeLanguage('en'); setIsSettingsOpen(false) }} className={`px-8 py-4 rounded-full text-xl font-bold ${i18n.language === 'en' ? 'bg-yellow-400 text-black' : 'bg-purple-700'}`}>EN</button>
                <button onClick={() => { i18n.changeLanguage('ru'); setIsSettingsOpen(false) }} className={`px-8 py-4 rounded-full text-xl font-bold ${i18n.language === 'ru' ? 'bg-yellow-400 text-black' : 'bg-purple-700'}`}>RU</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}