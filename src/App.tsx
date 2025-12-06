import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Coins, Trophy, Users, DollarSign, Settings, X } from 'lucide-react'
import canvasConfetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'

export default function App() {
  const { t, i18n } = useTranslation()
  const { coins, level, currentWord, letters, typedWord, path, addCoins, setNewWord, updateTypedWord, resetPath, levelUp } = useGameStore()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
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
      const dx = pos.x - (160 + lx)
      const dy = pos.y - (160 + ly)
      if (dx * dx + dy * dy < 28 * 28) {
        updateTypedWord(letter, i)
        addCoins(1)
      }
    })
  }

  const handleStart = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    resetPath()
    const pos = getEventPosition(e)
    checkLetterHit(pos)
  }

  const handleMove = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (path.length === 0) return
    const pos = getEventPosition(e)
    checkLetterHit(pos)
  }

  const handleEnd = () => {
    if (typedWord === currentWord.word) {
      addCoins(100 * level)
      canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      setShowLevelUp(true)
      setTimeout(() => {
        setShowLevelUp(false)
        levelUp()
        setNewWord()
      }, 1500)
    } else {
      resetPath()
    }
  }

  // Линия между центрами букв
  const linePath = path.map(i => {
    const { x, y } = getLetterPosition(i)
    return { x: 160 + x, y: 160 + y }
  }).map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')

  useEffect(() => {
    const el = circleRef.current
    if (!el) return

    const preventDefault = (e: Event) => e.preventDefault()

    el.addEventListener('touchstart', handleStart, { passive: false })
    el.addEventListener('touchmove', handleMove, { passive: false })
    el.addEventListener('touchend', handleEnd)

    el.addEventListener('mousedown', handleStart)
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseup', handleEnd)

    // Блокируем скролл и свайп Mini App
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      el.removeEventListener('touchstart', handleStart)
      el.removeEventListener('touchmove', handleMove)
      el.removeEventListener('touchend', handleEnd)
      el.removeEventListener('mousedown', handleStart)
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseup', handleEnd)
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [path, letters])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsSettingsOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white flex flex-col">
      {/* Шапка */}
      <div className="p-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold">Lv {level}</span>
        </div>
      </div>

      {/* Центральный круг — НЕ ДВИГАЕТСЯ */}
      <div className="flex-1 flex items-center justify-center touch-none">
        <div ref={circleRef} className="relative w-80 h-80 rounded-full bg-purple-950 shadow-2xl select-none">
          {/* Только эмодзи */}
          <div className="absolute inset-0 flex items-center justify-center text-7xl z-10">
            {currentWord.hint}
          </div>
          <p className="absolute top-4 left-0 right-0 text-center text-sm opacity-70 z-10">{currentWord.category}</p>

          {/* Буквы */}
          {letters.map((letter, i) => {
            const { x, y } = getLetterPosition(i)
            const isSelected = path.includes(i)
            return (
              <motion.div
                key={i}
                className={`absolute w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-20 transition-all ${
                  isSelected ? 'bg-yellow-400 text-black scale-110' : 'bg-purple-600 text-white'
                }`}
                style={{ left: `calc(50% + ${x}px - 28px)`, top: `calc(50% + ${y}px - 28px)` }}
              >
                {letter.toUpperCase()}
              </motion.div>
            )
          })}

          {/* Линия */}
          {path.length > 1 && (
            <svg className="absolute inset-0 pointer-events-none z-10" viewBox="0 0 320 320">
              <path d={linePath} stroke="yellow" strokeWidth="10" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Слово */}
      <div className="text-center text-5xl font-bold pb-20">{typedWord.toUpperCase()}</div>

      {/* Level Up */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.3 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-7xl font-bold text-yellow-400 drop-shadow-2xl">Level Up!</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Нижнее меню */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 flex justify-around py-4">
        <button className="flex flex-col items-center text-white">
          <Trophy className="w-7 h-7 mb-1" />
          <span className="text-xs">{t('boost')}</span>
        </button>
        <button className="flex flex-col items-center text-white">
          <Users className="w-7 h-7 mb-1" />
          <span className="text-xs">{t('friends')}</span>
        </button>
        <button className="flex flex-col items-center text-white">
          <DollarSign className="w-7 h-7 mb-1" />
          <span className="text-xs">{t('earn')}</span>
        </button>
        <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center text-white">
          <Settings className="w-7 h-7 mb-1" />
          <span className="text-xs">{t('settings')}</span>
        </button>
      </div>

      {/* Настройки */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              className="bg-purple-900 rounded-2xl p-8 max-w-xs w-full mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('settings')}</h2>
                <button onClick={() => setIsSettingsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center gap-6">
                <button onClick={() => changeLanguage('en')} className={`px-8 py-4 rounded-full text-xl font-bold ${i18n.language === 'en' ? 'bg-yellow-400 text-black' : 'bg-purple-700'}`}>
                  EN
                </button>
                <button onClick={() => changeLanguage('ru')} className={`px-8 py-4 rounded-full text-xl font-bold ${i18n.language === 'ru' ? 'bg-yellow-400 text-black' : 'bg-purple-700'}`}>
                  RU
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}