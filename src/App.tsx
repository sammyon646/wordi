import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Zap, Trophy, Users, DollarSign } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'

export default function App() {
  const { t, i18n } = useTranslation()
  const { coins, energy, maxEnergy, level, currentWord, typedWord, clicks, addCoins, consumeEnergy, setNewWord, updateTypedWord, setClicks, levelUp } = useGameStore()

  const letters = currentWord.word.split('').sort(() => Math.random() - 0.5)

  const handleLetterClick = (letter: string, e: React.MouseEvent) => {
    if (energy <= 0) return

    const rect = e.currentTarget.getBoundingClientRect()
    const newClick = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }
    setClicks([...clicks, newClick])

    updateTypedWord(letter)
    consumeEnergy(1)
    addCoins(1) // +1 за тап

    if (typedWord + letter === currentWord.word) {
      addCoins(100) // Бонус за слово
      levelUp()
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }) // Конфетти
      setTimeout(() => setNewWord(), 500)
    }
  }

  useEffect(() => {
    useGameStore.getState().regenerateEnergy()
  }, [])

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white overflow-hidden flex flex-col">
      {/* Шапка с монетами, энергией, уровнем */}
      <div className="p-4 flex justify-between items-center bg-black/50">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          <span className="font-bold">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-400" />
          <span>{energy}/{maxEnergy}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-gold-400" />
          <span>Lv {level}</span>
        </div>
      </div>

      {/* Игровой круг */}
      <div className="flex-1 flex items-center justify-center pb-20">
        <motion.div className="relative w-72 h-72 cursor-pointer" whileTap={{ scale: 0.98 }}>
          {/* Подсказка в центре */}
          <div className="absolute inset-0 flex items-center justify-center text-5xl">{currentWord.hint}</div>
          <p className="absolute top-0 left-0 right-0 text-center text-sm opacity-70">{currentWord.category}</p>

          {/* Буквы по кругу */}
          {letters.map((letter, i) => {
            const angle = (i / letters.length) * 2 * Math.PI - Math.PI / 2
            const x = 130 * Math.cos(angle)
            const y = 130 * Math.sin(angle)
            return (
              <motion.button
                key={i}
                className="absolute w-14 h-14 rounded-full bg-purple-600 text-2xl font-bold text-white shadow-lg"
                style={{ top: `calc(50% + ${y}px)`, left: `calc(50% + ${x}px)` }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleLetterClick(letter, e)}
              >
                {letter.toUpperCase()}
              </motion.button>
            )
          })}

          {/* Плавающие +1 */}
          <AnimatePresence>
            {clicks.map((click) => (
              <motion.div
                key={click.id}
                className="absolute text-3xl font-bold text-yellow-300 pointer-events-none"
                style={{ left: click.x, top: click.y }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -80 }}
                transition={{ duration: 0.8 }}
                onAnimationComplete={() => setClicks(clicks.filter(c => c.id !== click.id))}
              >
                +1
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Собранное слово */}
      <div className="text-center text-4xl font-bold mb-4">{typedWord.toUpperCase()}</div>

      {/* Переключатель языка */}
      <div className="text-center mb-4">
        <button onClick={() => changeLanguage('en')} className="mx-2">EN</button>
        <button onClick={() => changeLanguage('ru')} className="mx-2">RU</button>
      </div>

      {/* Нижнее меню */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 border-t border-white/20 flex justify-around py-4">
        <button className="flex flex-col items-center">
          <Trophy className="w-6 h-6 mb-1" />
          <span className="text-xs">{t('boost')}</span>
        </button>
        <button className="flex flex-col items-center">
          <Users className="w-6 h-6 mb-1" />
          <span className="text-xs">{t('friends')}</span>
        </button>
        <button className="flex flex-col items-center">
          <DollarSign className="w-6 h-6 mb-1" />
          <span className="text-xs">{t('earn')}</span>
        </button>
      </div>
    </div>
  )
}