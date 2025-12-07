import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Coins, Trophy, Users, DollarSign, Settings, X, Lightbulb } from 'lucide-react'
import canvasConfetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'

const CIRCLE_SIZE = 240
const CENTER = CIRCLE_SIZE / 2
const RADIUS = CIRCLE_SIZE * 0.38
const HIT_RADIUS = 24
const LETTER_SIZE = 48

const triggerHaptic = () => {
  const tg: any = (window as any)?.Telegram?.WebApp
  tg?.HapticFeedback?.impactOccurred?.('light')
  if (navigator?.vibrate) navigator.vibrate(10)
}

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
    updateTypedWord,
    resetPath,
    trySolveTypedWord,
    setNewPuzzle,
  } = useGameStore()

  const coinsValue = useSpring(coins, { stiffness: 120, damping: 16 })
  const coinsDisplay = useTransform(coinsValue, (v) => Math.round(v).toLocaleString())
  useEffect(() => {
    coinsValue.set(coins)
  }, [coins, coinsValue])

  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHintsOpen, setIsHintsOpen] = useState(false)
  const circleRef = useRef<HTMLDivElement>(null)
  const isPointerActive = useRef(false)
  const displayedLetters = typedWord.split('')

  const getLetterPosition = (i: number) => {
    const angle = (i / letters.length) * 2 * Math.PI - Math.PI / 2
    return { x: RADIUS * Math.cos(angle), y: RADIUS * Math.sin(angle) }
  }

  const getEventPosition = (e: PointerEvent | React.PointerEvent) => {
    const rect = circleRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const checkLetterHit = (pos: { x: number; y: number }) => {
    letters.forEach((letter, i) => {
      if (path.includes(i)) return
      const { x: lx, y: ly } = getLetterPosition(i)
      const dx = pos.x - (CENTER + lx)
      const dy = pos.y - (CENTER + ly)
      if (dx * dx + dy * dy < HIT_RADIUS * HIT_RADIUS) {
        triggerHaptic()
        updateTypedWord(letter, i)
      }
    })
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isPointerActive.current = true
    resetPath()
    checkLetterHit(getEventPosition(e.nativeEvent))
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerActive.current) return
    e.preventDefault()
    e.stopPropagation()
    checkLetterHit(getEventPosition(e.nativeEvent))
  }
  const handlePointerUp = () => {
    if (!isPointerActive.current) return
    isPointerActive.current = false
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
      }, 1200)
    }
  }

  const linePath = path
    .map((i) => {
      const { x, y } = getLetterPosition(i)
      return { x: CENTER + x, y: CENTER + y }
    })
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsSettingsOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-[#0d041c] text-white flex flex-col pb-[env(safe-area-inset-bottom)]">
      {/* Шапка */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Coins className="w-7 h-7 text-yellow-400" />
          <motion.span className="text-xl font-bold" key={coins}>
            {coinsDisplay as any}
          </motion.span>
        </div>
        <button
          onClick={() => setIsHintsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-700 hover:bg-purple-600 transition"
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-semibold">{t('hints', 'Hints')}</span>
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-400" />
          <span className="text-xl font-bold">
            {t('level', 'Lv')} {level}
          </span>
        </div>
      </div>

      {/* Основная зона: кроссворд + вывод набранного слова + круг */}
      <div className="flex-1 flex flex-col px-4 pb-0 gap-2">
        {/* Кроссворд */}
        <div className="flex justify-center">
          <div className="inline-flex flex-col gap-1 bg-purple-950/60 p-3 rounded-xl border border-purple-700/70 shadow-lg">
            {Array.from({ length: maxRow + 1 }).map((_, r) => (
              <div key={r} className="flex gap-1">
                {Array.from({ length: maxCol + 1 }).map((_, c) => {
                  const key = `${r}-${c}`
                  const isActive = activeCells.has(key)
                  const letter = gridLetters[key]
                  return (
                    <motion.div
                      key={c}
                      className={`w-10 h-10 rounded-md text-lg font-bold flex items-center justify-center ${
                        isActive ? 'bg-purple-800/80 border border-purple-500/80 text-white' : 'bg-transparent'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (r + c) * 0.02, type: 'spring', stiffness: 220 }}
                    >
                      {letter ? letter.toUpperCase() : ''}
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Выбранные буквы */}
        <div className="h-16 flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-xs px-4">
            {displayedLetters.map((letter, i) => (
              <motion.div
                key={i}
                className="w-10 h-10 bg-[#2b1755] border-2 border-purple-500/80 rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
              >
                {letter.toUpperCase()}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Круг и иконки */}
        <div className="flex-1 flex items-end justify-center pb-4">
          <div
            className="relative flex items-center justify-center"
            style={{ width: CIRCLE_SIZE + 120, height: CIRCLE_SIZE + 120 }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-[#1f0b3f] flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-xs">{t('boost', 'boost')}</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-[#1f0b3f] flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs">{t('friends', 'friends')}</span>
            </div>
            <div className="absolute left-16 bottom-2 flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-[#1f0b3f] flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-xs">{t('earn', 'earn')}</span>
            </div>
            <div className="absolute right-16 bottom-2 flex flex-col items-center gap-1">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-12 h-12 rounded-full bg-[#1f0b3f] flex items-center justify-center shadow-lg"
              >
                <Settings className="w-6 h-6" />
              </button>
              <span className="text-xs">{t('settings', 'settings')}</span>
            </div>

            <motion.div
              ref={circleRef}
              className="absolute inset-0 m-auto rounded-full bg-[#201040] shadow-2xl"
              style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, touchAction: 'none' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                isPointerActive.current = false
                resetPath()
              }}
            >
              <div className="absolute inset-0 z-10" />
              {letters.map((letter, i) => {
                const { x, y } = getLetterPosition(i)
                const isSelected = path.includes(i)
                return (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-20 transition-all duration-200 ${
                      isSelected ? 'bg-yellow-400 text-black scale-110' : 'bg-purple-500 text-white'
                    }`}
                    style={{
                      width: LETTER_SIZE,
                      height: LETTER_SIZE,
                      left: `calc(50% + ${x}px - ${LETTER_SIZE / 2}px)`,
                      top: `calc(50% + ${y}px - ${LETTER_SIZE / 2}px)`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                  >
                    {letter.toUpperCase()}
                  </motion.div>
                )
              })}
              {path.length > 1 && (
                <svg className="absolute inset-0 pointer-events-none z-10" viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
                  <path d={linePath} stroke="#fbbf24" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </motion.div>
          </div>
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
              {t('levelUp', 'Level Up!')}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hints */}
      <AnimatePresence>
        {isHintsOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsHintsOpen(false)}
          >
            <motion.div
              className="bg-purple-900 rounded-2xl p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('hints', 'Hints')}</h2>
                <button onClick={() => setIsHintsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-sm space-y-3">
                <div>
                  <div className="font-bold mb-1">{t('across', 'Across')}:</div>
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
                </div>
                <div>
                  <div className="font-bold mb-1">{t('down', 'Down')}:</div>
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsSettingsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-purple-900 rounded-2xl p-8 max-w-xs w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('settings', 'Settings')}</h2>
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