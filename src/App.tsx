import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Coins, Trophy, Users, DollarSign, Settings, X } from 'lucide-react'
import canvasConfetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'

export default function App() {
  const { t, i18n } = useTranslation()
  const {
    coins,
    level,
    letters,
    typedWord,
    path,
    entries,
    gridLetters,
    addCoins,
    updateTypedWord,
    resetPath,
    trySolveTypedWord,
    setNewPuzzle,
  } = useGameStore()

  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const circleRef = useRef<HTMLDivElement>(null)

  // Квадратики текущего ввода (длина равна текущему слову ввода)
  const displayedLetters = typedWord.split('')

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
        addCoins(1) // монета за выбор буквы
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
    if (!typedWord) {
      resetPath()
      return
    }

    const { solved, allSolved } = trySolveTypedWord()
    if (solved && allSolved) {
      canvasConfetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } })
      setShowLevelUp(true)
      setTimeout(() => {
        setShowLevelUp(false)
        setNewPuzzle()
      }, 1800)
    }
  }

  const linePath = path
    .map((i) => {
      const { x, y } = getLetterPosition(i)
      return { x: 160 + x, y: 160 + y }
    })
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')

  // Область активных клеток сетки
  const { maxRow, maxCol, activeCells } = useMemo(() => {
    let mr = 0
    let mc = 0
    const set = new Set<string>()
    entries.forEach((entry) => {
      entry.answer.split('').forEach((_, idx) => {
        const r = entry.direction === 'across' ? entry.row : entry.row + idx
        const c = entry.direction === 'across' ? entry.col + idx : entry.col
        mr = Math.max(mr, r)
        mc = Math.max(mc, c)
        set.add(`${r}-${c}`)
      })
    })
    return { maxRow: mr, maxCol: mc, activeCells: set }
  }, [entries])

  useEffect(() => {
    const el = circleRef.current
    if (!el) return

    el.addEventListener('touchstart', handleStart, { passive: false })
    el.addEventListener('touchmove', handleMove, { passive: false })
    el.addEventListener('touchend', handleEnd)
    el.addEventListener('mousedown', handleStart)
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseup', handleEnd)

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
  }, [path, letters, typedWord])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsSettingsOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black text-white flex flex-col">
      {/* Шапка */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Coins className="w-7 h-7 text-yellow-400" />
          <span className="text-xl font-bold">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-400" />
          <span className="text-xl font-bold">Lv {level}</span>
        </div>
      </div>

      {/* Кроссворд */}
      <div className="flex justify-center px-4">
        <div className="inline-flex flex-col gap-1 bg-purple-950/40 p-3 rounded-xl border border-purple-700">
          {Array.from({ length: maxRow + 1 }).map((_, r) => (
            <div key={r} className="flex gap-1">
              {Array.from({ length: maxCol + 1 }).map((_, c) => {
                const key = `${r}-${c}`
                const isActive = activeCells.has(key)
                const letter = gridLetters[key]
                return (
                  <div
                    key={c}
                    className={`w-10 h-10 rounded-md text-lg font-bold flex items-center justify-center ${
                      isActive ? 'bg-purple-800 border border-purple-600' : 'bg-transparent'
                    }`}
                  >
                    {letter ? letter.toUpperCase() : ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Подсказки */}
      <div className="px-4 py-3 text-sm opacity-80">
        <div className="font-bold mb-1">Across:</div>
        <div className="flex flex-wrap gap-2">
          {entries
            .filter((e) => e.direction === 'across')
            .map((e) => (
              <span
                key={`a-${e.id}`}
                className={`px-2 py-1 rounded-full ${
                  gridLetters[`${e.row}-${e.col}`] ? 'bg-green-500/80 text-black' : 'bg-white/10'
                }`}
              >
                {e.id}. {e.clue}
              </span>
            ))}
        </div>
        <div className="font-bold mt-3 mb-1">Down:</div>
        <div className="flex flex-wrap gap-2">
          {entries
            .filter((e) => e.direction === 'down')
            .map((e) => (
              <span
                key={`d-${e.id}`}
                className={`px-2 py-1 rounded-full ${
                  gridLetters[`${e.row}-${e.col}`] ? 'bg-green-500/80 text-black' : 'bg-white/10'
                }`}
              >
                {e.id}. {e.clue}
              </span>
            ))}
        </div>
      </div>

      {/* Квадратики ввода (текущее слово) */}
      <div className="flex items-end justify-center pb-4">
        <div className="flex gap-2 flex-wrap justify-center max-w-xs px-4">
          {displayedLetters.map((letter, i) => (
            <motion.div
              key={i}
              className="w-12 h-12 bg-purple-900/80 border-2 border-purple-600 rounded-lg flex items-center justify-center text-3xl font-bold shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
            >
              {letter.toUpperCase()}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Центральный круг */}
      <div className="flex-1 flex items-center justify-center">
        <div ref={circleRef} className="relative w-80 h-80 rounded-full bg-purple-950 shadow-2xl">
          {/* Подсказка */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <div className="text-xl mb-1">Соединяй буквы</div>
            <p className="text-sm opacity-70">Собери слова для кроссворда</p>
          </div>

          {/* Буквы по кругу */}
          {letters.map((letter, i) => {
            const { x, y } = getLetterPosition(i)
            const isSelected = path.includes(i)
            return (
              <motion.div
                key={i}
                className={`absolute w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-20 transition-all duration-200 ${
                  isSelected ? 'bg-yellow-400 text-black scale-110' : 'bg-purple-600 text-white'
                }`}
                style={{ left: `calc(50% + ${x}px - 28px)`, top: `calc(50% + ${y}px - 28px)` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
              >
                {letter.toUpperCase()}
              </motion.div>
            )
          })}

          {/* Линия соединения */}
          {path.length > 1 && (
            <svg className="absolute inset-0 pointer-events-none z-10" viewBox="0 0 320 320">
              <path d={linePath} stroke="#fbbf24" strokeWidth="10" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Level Up */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-7xl font-bold text-yellow-400 drop-shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.3, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 1.2, type: 'spring' }}
            >
              Level Up!
            </motion.div>
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
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              className="bg-purple-900 rounded-2xl p-8 max-w-xs w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('settings')}</h2>
                <button onClick={() => setIsSettingsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-8 py-4 rounded-full text-xl font-bold ${
                    i18n.language === 'en' ? 'bg-yellow-400 text-black' : 'bg-purple-700'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('ru')}
                  className={`px-8 py-4 rounded-full text-xl font-bold ${
                    i18n.language === 'ru' ? 'bg-yellow-400 text-black' : 'bg-purple-700'
                  }`}
                >
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