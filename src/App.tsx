import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Coins, Zap, Trophy, Users, DollarSign } from 'lucide-react'
import canvasConfetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'

export default function App() {
  const { t, i18n } = useTranslation()
  const { coins, energy, maxEnergy, level, currentWord, letters, typedWord, path, addCoins, consumeEnergy, setNewWord, updateTypedWord, resetPath, levelUp } = useGameStore()
  const isSwiping = useRef(false)
  const [linePoints, setLinePoints] = useState<{ x: number; y: number }[]>([])
  const circleRef = useRef<HTMLDivElement>(null)

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
      const dx = pos.x - (144 + lx)
      const dy = pos.y - (144 + ly)
      if (dx * dx + dy * dy < 28 * 28) {
        updateTypedWord(letter, i)
        consumeEnergy(1)
        addCoins(1)
        // Добавь проверку смежности, если нужно: if (path.length > 0 && Math.abs(path[path.length - 1] - i) > 1) return
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
    setLinePoints(prev => [...prev, pos])
    checkLetterHit(pos)
  }

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    isSwiping.current = false
    setLinePoints([])
    if (typedWord === currentWord.word) {
      addCoins(100 * level)
      canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      levelUp()
      setNewWord()
    } else {
      resetPath()
    }
  }

  // Линия между центрами букв (прямая, потолще)
  const linePath = path.map(i => {
    const { x, y } = getLetterPosition(i)
    return { x: 144 + x, y: 144 + y }
  }).map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')

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
  }, [currentWord, letters])

  useEffect(() => {
    useGameStore.getState().regenerateEnergy()
  }, [])

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white flex flex-col items-center justify-center">
      {/* Шапка */}
      <div className="p-4 flex justify-between items-center w-full">
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

      {/* Круг по центру */}
      <div className="relative w-80 h-80 rounded-full bg-black/50 shadow-xl flex items-center justify-center pb-20" ref={circleRef}>
        {/* Подсказка */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl z-10">{currentWord.hint}</div>
        <p className="absolute top-4 left-0 right-0 text-center text-sm opacity-70 z-10">{currentWord.category}</p>

        {/* Буквы */}
        {letters.map((letter, i) => {
          const { x, y } = getLetterPosition(i)
          const isSelected = path.includes(i)
          return (
            <motion.div
              key={i}
              className={`absolute w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-20 ${isSelected ? 'bg-yellow-400 text-black' : 'bg-purple-600 text-white'}`}
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
              animate={{ scale: isSelected ? 1.1 : 1 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}  // Плавная анимация без прыжков
            >
              {letter.toUpperCase()}
            </motion.div>
          )
        })}

        {/* Прямая линия между центрами, потолще */}
        {path.length > 1 && (
          <svg className="absolute inset-0 pointer-events-none z-10" viewBox="0 0 320 320">
            <path
              d={linePath}
              stroke="yellow"
              strokeWidth="6"  // Потолще
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
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