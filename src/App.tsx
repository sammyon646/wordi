import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Coins, Zap, Trophy, Users, DollarSign } from 'lucide-react'
import canvasConfetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'

export default function App() {
  const { t, i18n } = useTranslation()
  const { coins, energy, maxEnergy, level, currentWord, typedWord, path, addCoins, consumeEnergy, setNewWord, updateTypedWord, resetPath, levelUp } = useGameStore()
  const isSwiping = useRef(false)
  const [linePoints, setLinePoints] = useState<{ x: number; y: number }[]>([])  // Изменил на state для re-render
  const circleRef = useRef<HTMLDivElement>(null)

  const letters = currentWord.word.split('').sort(() => Math.random() - 0.5) // Перемешиваем

  const getLetterPosition = (i: number) => {
    const angle = (i / letters.length) * 2 * Math.PI - Math.PI / 2
    const radius = 130
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    return { x, y }
  }

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    const rect = circleRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const checkLetterHit = (pos: { x: number; y: number }) => {
    letters.forEach((letter, i) => {
      if (path.includes(i)) return
      const { x: lx, y: ly } = getLetterPosition(i)
      const dx = pos.x - (144 + lx) // Центр круга w-72 = 288px / 2 = 144
      const dy = pos.y - (144 + ly)
      if (dx * dx + dy * dy < 28 * 28) { // Радиус буквы ~28px (w-14 / 2 = 28)
        updateTypedWord(letter, i)
        consumeEnergy(1)
        addCoins(1) // +1 за букву
      }
    })
  }

  const handleStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    resetPath()
    isSwiping.current = true
    const pos = getEventPosition(e)
    setLinePoints([pos])
    checkLetterHit(pos)
  }

  const handleMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!isSwiping.current) return
    const pos = getEventPosition(e)
    setLinePoints(prev => [...prev, pos])  // Обновление state вызывает re-render
    checkLetterHit(pos)
  }

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    isSwiping.current = false
    setLinePoints([])
    if (typedWord === currentWord.word) {
      addCoins(100 * level) // Бонус за слово
      canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      levelUp()
      setNewWord()
    } else {
      resetPath()
    }
  }

  useEffect(() => {
    const circle = circleRef.current
    if (circle) {
      circle.addEventListener('mousedown', handleStart)
      circle.addEventListener('mousemove', handleMove)
      circle.addEventListener('mouseup', handleEnd)
      circle.addEventListener('touchstart', handleStart)
      circle.addEventListener('touchmove', handleMove)
      circle.addEventListener('touchend', handleEnd)
      return () => {
        circle.removeEventListener('mousedown', handleStart)
        circle.removeEventListener('mousemove', handleMove)
        circle.removeEventListener('mouseup', handleEnd)
        circle.removeEventListener('touchstart', handleStart)
        circle.removeEventListener('touchmove', handleMove)
        circle.removeEventListener('touchend', handleEnd)
      }
    }
  }, [currentWord])

  useEffect(() => {
    useGameStore.getState().regenerateEnergy()
  }, [])

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white flex flex-col">
      {/* Шапка */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6" />
          {coins.toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6" />
          {energy}/{maxEnergy}
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Lv {level}
        </div>
      </div>

      {/* Круг */}
      <div className="flex-1 flex items-center justify-center pb-20">
        <div ref={circleRef} className="relative w-72 h-72 cursor-pointer select-none">
          {/* Подсказка */}
          <div className="absolute inset-0 flex items-center justify-center text-5xl">{currentWord.hint}</div>
          <p className="absolute top-0 left-0 right-0 text-center text-sm opacity-70">{currentWord.category}</p>

          {/* Буквы */}
          {letters.map((letter, i) => {
            const { x, y } = getLetterPosition(i)
            const isSelected = path.includes(i)
            return (
              <motion.div
                key={i}
                className={`absolute w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ${isSelected ? 'bg-yellow-400 text-black' : 'bg-purple-600 text-white'}`}
                style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                animate={{ scale: isSelected ? 1.1 : 1 }}
              >
                {letter.toUpperCase()}
              </motion.div>
            )
          })}

          {/* Линия */}
          {linePoints.length > 1 && (
            <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 288 288">
              <path
                d={linePoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')}
                stroke="yellow"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Слово */}
      <div className="text-center text-4xl font-bold mb-4">{typedWord.toUpperCase()}</div>

      {/* Язык */}
      <div className="text-center mb-4">
        <button onClick={() => changeLanguage('en')} className="mx-2">EN</button>
        <button onClick={() => changeLanguage('ru')} className="mx-2">RU</button>
      </div>

      {/* Меню */}
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