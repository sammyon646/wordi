import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Coins, Trophy, DollarSign, Settings, Lightbulb, Palette, Info } from 'lucide-react'
import GlowModal from './components/GlowModal'
import canvasConfetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'
import WaveBackground from './WaveBackground'
import { themes, wallpapers } from './data/cosmetics'
import type { ThemeId, WallpaperId } from './data/cosmetics'

const BASE_BOARD = 240
const BASE_CIRCLE = 240
const BASE_LETTER = 48
const BASE_MAX_CELL = 48
const INNER_PAD = 12
const HIT_RADIUS = 24
const HEADER_EXTRA = 20

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
    solved,
    hydrateFromServer,
    selectedTheme,
    selectedWallpaper,
    unlockedThemes,
    unlockedWallpapers,
    selectTheme,
    selectWallpaper,
    buyTheme,
    buyWallpaper,
    puzzleIndex,
  } = useGameStore()

  useEffect(() => {
    const tg: any = (window as any)?.Telegram?.WebApp
    tg?.ready?.()
    tg?.expand?.()
    tg?.disableVerticalSwipe?.()
    tg?.disableVerticalSwipes?.()
  }, [])

  // Гидрация из бекенда
  useEffect(() => {
    async function load() {
      try {
        const tg = (window as any)?.Telegram?.WebApp
        const initData = tg?.initData || ''
        const resp = await fetch(`/api/state?initData=${encodeURIComponent(initData)}`)
        const data = await resp.json()
        if (data.user) {
          hydrateFromServer({
            coins: data.user.coins,
            level: data.user.level,
            puzzleIndex: data.user.puzzle_index,
            solved: data.user.solved || {},
            selectedTheme: data.user.selected_theme as ThemeId,
            selectedWallpaper: data.user.selected_wallpaper as WallpaperId,
            unlockedThemes: data.user.unlocked_themes || ['purple'],
            unlockedWallpapers: data.user.unlocked_wallpapers || ['wave'],
          })
        }
      } catch (e) {
        console.error('Failed to load state', e)
      }
    }
    load()
  }, [hydrateFromServer])

  // Автосохранение на бекенд
  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp
    const initData = tg?.initData || ''
    const save = async () => {
      try {
        await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initData,
            state: {
              coins,
              level,
              puzzleIndex,
              solved,
              selectedTheme,
              selectedWallpaper,
              unlockedThemes,
              unlockedWallpapers,
            },
          }),
        })
      } catch (e) {
        console.error('Failed to save state', e)
      }
    }
    const tId = setTimeout(save, 500)
    return () => clearTimeout(tId)
  }, [coins, level, puzzleIndex, solved, selectedTheme, selectedWallpaper, unlockedThemes, unlockedWallpapers])

  const [scale, setScale] = useState(1)
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const factor = Math.min(vw / 390, vh / 844)
      setScale(Math.max(0.9, Math.min(1.25, factor)))
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const currentTheme = themes.find((t) => t.id === selectedTheme) || themes[0]

  const GRID_GAP = 4 * scale
  const CIRCLE_SIZE = BASE_CIRCLE * scale
  const CENTER = CIRCLE_SIZE / 2
  const RADIUS = CIRCLE_SIZE * 0.38
  const LETTER_SIZE = BASE_LETTER * scale
  const BOARD_SIZE = BASE_BOARD * scale
  const MAX_CELL_SIZE = BASE_MAX_CELL * scale

  const coinsValue = useSpring(coins, { stiffness: 120, damping: 16 })
  const coinsDisplay = useTransform(coinsValue, (v) => Math.round(v).toLocaleString())
  useEffect(() => {
    coinsValue.set(coins)
  }, [coins, coinsValue])

  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHintsOpen, setIsHintsOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isCosmeticsOpen, setIsCosmeticsOpen] = useState(false)
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
    const { solved: solvedWord, allSolved } = trySolveTypedWord()
    if (solvedWord && allSolved) {
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

  const { maxRow, maxCol, minRow, minCol, activeCells } = useMemo(() => {
    let mr = 0
    let mc = 0
    let minR = Infinity
    let minC = Infinity
    const set = new Set<string>()
    entries.forEach((entry) => {
      entry.answer.split('').forEach((_, idx) => {
        const r = entry.direction === 'across' ? entry.row : entry.row + idx
        const c = entry.direction === 'across' ? entry.col + idx : entry.col
        mr = Math.max(mr, r)
        mc = Math.max(mc, c)
        minR = Math.min(minR, r)
        minC = Math.min(minC, c)
        set.add(`${r}-${c}`)
      })
    })
    if (minR === Infinity) minR = 0
    if (minC === Infinity) minC = 0
    return { maxRow: mr, maxCol: mc, minRow: minR, minCol: minC, activeCells: set }
  }, [entries])

  const rows = maxRow - minRow + 1
  const cols = maxCol - minCol + 1

  const availableW = BOARD_SIZE - INNER_PAD * 2 - GRID_GAP * (cols - 1)
  const availableH = BOARD_SIZE - INNER_PAD * 2 - GRID_GAP * (rows - 1)

  const cellSize = Math.min(MAX_CELL_SIZE, availableW / cols, availableH / rows)
  const gridW = cellSize * cols + GRID_GAP * (cols - 1)
  const gridH = cellSize * rows + GRID_GAP * (rows - 1)

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsSettingsOpen(false)
  }

  return (
    <div
      className="min-h-[100dvh] w-screen text-white flex flex-col overflow-hidden relative"
      style={{
        ...currentTheme.vars,
        overscrollBehavior: 'none',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 54px)',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 0 }}>
        <WaveBackground theme={selectedTheme} />
      </div>

      {/* Шапка */}
      <div className="px-4 pb-2 grid grid-cols-3 items-center relative z-30">
        <div className="flex items-center gap-2 pr-4">
          <Coins className="w-7 h-7" style={{ color: 'var(--selected)' }} />
          <motion.span className="text-xl font-bold" key={coins}>
            {coinsDisplay as any}
          </motion.span>
        </div>

        <button
          onClick={() => setIsHintsOpen(true)}
          className="justify-self-center flex items-center gap-2 px-4 py-2 rounded-full transition"
          style={{ background: 'var(--accent)', color: 'var(--text)' }}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-semibold">{t('hints', 'Hints')}</span>
        </button>

        <div className="flex items-center gap-2 pl-4 justify-self-end">
          <Trophy className="w-7 h-7" style={{ color: 'var(--selected)' }} />
          <span className="text-xl font-bold">
            {t('level', 'Lv')} {level}
          </span>
        </div>
      </div>

      {/* Основная зона */}
      <div className="flex-1 flex flex-col px-4 pb-24 overflow-hidden relative z-10" style={{ paddingTop: HEADER_EXTRA }}>
        <div className="flex-1 flex flex-col items-center justify-between">
          {/* Кроссворд */}
          <div
            className="rounded-2xl border-2 shadow-lg p-3 flex items-center justify-center"
            style={{ width: BOARD_SIZE, height: BOARD_SIZE, background: 'var(--panel)', borderColor: 'var(--panel-border)' }}
          >
            <div
              className="grid"
              style={{
                width: gridW,
                height: gridH,
                gap: GRID_GAP,
                gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              }}
            >
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  const rGlobal = r + minRow
                  const cGlobal = c + minCol
                  const key = `${rGlobal}-${cGlobal}`
                  const isActive = activeCells.has(key)
                  const letter = gridLetters[key]
                  return (
                    <motion.div
                      key={`${r}-${c}`}
                      className={`rounded-md font-bold flex items-center justify-center ${
                        isActive ? 'border text-white' : 'bg-transparent'
                      }`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        overflow: 'hidden',
                        borderColor: isActive ? 'var(--accent-strong)' : 'transparent',
                        backgroundColor: letter ? 'var(--cell-fill)' : 'transparent',
                        fontSize: `${cellSize * 0.5}px`,
                        lineHeight: `${cellSize}px`,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (r + c) * 0.02, type: 'spring', stiffness: 220 }}
                    >
                      {letter && (
                        <motion.span
                          key={`${key}-${letter}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: (r + c) * 0.02 }}
                          style={{ display: 'block' }}
                        >
                          {letter.toUpperCase()}
                        </motion.span>
                      )}
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>

          {/* Выбранные буквы */}
          <div className="min-h-[72px] flex items-center justify-center mt-6 mb-6" style={{ transform: 'translateY(-8px)' }}>
            <div className="flex gap-2 flex-wrap justify-center max-w-xs px-4">
              {displayedLetters.map((letter, i) => (
                <motion.div
                  key={i}
                  className="w-10 h-10 border-2 rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg"
                  style={{ background: 'var(--circle)', borderColor: 'var(--accent-strong)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                >
                  {letter.toUpperCase()}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Круг */}
          <div className="pb-1">
            <div
              className="relative flex itemscenter justify-center"
              style={{
                width: CIRCLE_SIZE + 60,
                height: CIRCLE_SIZE + 60,
                transform: 'translateY(-48px)',
              }}
              onTouchMove={(e) => e.preventDefault()}
            >
              <motion.div
                ref={circleRef}
                className="absolute inset-0 m-auto rounded-full shadow-2xl"
                style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, touchAction: 'none', background: 'var(--circle)' }}
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
                    <div
                      key={i}
                      className="absolute rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-20 transition-all duration-200"
                      style={{
                        width: LETTER_SIZE,
                        height: LETTER_SIZE,
                        left: `calc(50% + ${x}px - ${LETTER_SIZE / 2}px)`,
                        top: `calc(50% + ${y}px - ${LETTER_SIZE / 2}px)`,
                        background: isSelected ? 'var(--selected)' : 'var(--letter)',
                        color: isSelected ? '#000' : 'var(--text)',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {letter.toUpperCase()}
                    </div>
                  )
                })}
                {path.length > 1 && (
                  <svg className="absolute inset-0 pointer-events-none z-10" viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
                    <path d={linePath} stroke="var(--selected)" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя панель */}
      <nav
        className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t z-40"
        style={{ paddingBottom: `max(env(safe-area-inset-bottom), 12px)`, background: 'var(--nav-bg)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-around px-4 py-2">
          {[
            { icon: <Info className="w-6 h-6" />, label: 'about', onClick: () => setIsAboutOpen(true) },
            { icon: <DollarSign className="w-6 h-6" />, label: t('earn', 'earn') },
            { icon: <Palette className="w-6 h-6" />, label: t('cosmetics', 'cosmetics'), onClick: () => setIsCosmeticsOpen(true) },
            { icon: <Settings className="w-6 h-6" />, label: t('settings', 'settings'), onClick: () => setIsSettingsOpen(true) },
          ].map((item, idx, arr) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 relative">
              <button
                onClick={item.onClick}
                className="flex flex-col items-center gap-1 w-full focus:outline-none"
                style={{ WebkitTapHighlightColor: 'transparent', color: 'var(--text)' }}
              >
                <div className="flex items-center justify-center">{item.icon}</div>
                <span className="text-xs">{item.label}</span>
              </button>
              {idx < arr.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px" style={{ background: 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>
      </nav>

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
              className="text-7xl font-bold drop-shadow-2xl"
              style={{ color: 'var(--selected)' }}
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
      <GlowModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
        title={t('hints', 'Hints')}
      >
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
      </GlowModal>

      {/* About */}
      <GlowModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="WORDI v1.0">
        <p>Match letters, complete mini-crosswords, collect coins and beat all the levels!</p>
        <a
          href="https://t.me/semyon_888"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition w-full text-center mt-3"
        >
          Contact support
        </a>
      </GlowModal>

      {/* Settings — только смена языка */}
      <GlowModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t('settings', 'Settings')}>
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
      </GlowModal>

      {/* Cosmetics */}
      <GlowModal isOpen={isCosmeticsOpen} onClose={() => setIsCosmeticsOpen(false)} title={t('cosmetics', 'Cosmetics')}>
        <div className="space-y-4">
          <div>
            <div className="font-bold mb-2">Themes</div>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((th) => {
                const unlocked = unlockedThemes.includes(th.id)
                const selected = selectedTheme === th.id
                return (
                  <button
                    key={th.id}
                    onClick={() => (unlocked ? selectTheme(th.id) : buyTheme(th.id, th.price))}
                    className={`px-4 py-3 rounded-2xl font-bold border text-left ${
                      selected ? 'ring-2 ring-yellow-400' : ''
                    } ${unlocked ? '' : 'opacity-80'}`}
                    style={{
                      borderColor: th.vars['--accent'],
                      background: th.vars['--circle'],
                      color: th.vars['--text'],
                    }}
                  >
                    <div>{th.name}</div>
                    <div className="text-xs opacity-80">
                      {unlocked ? (selected ? 'Selected' : 'Select') : `Buy: ${th.price} 💰`}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="font-bold mb-2">Wallpapers</div>
            <div className="grid grid-cols-3 gap-3">
              {wallpapers.map((wp) => {
                const unlocked = unlockedWallpapers.includes(wp.id)
                const selected = selectedWallpaper === wp.id
                return (
                  <button
                    key={wp.id}
                    onClick={() => (unlocked ? selectWallpaper(wp.id) : buyWallpaper(wp.id, wp.price))}
                    className={`px-4 py-3 rounded-2xl font-bold border text-left ${
                      selected ? 'ring-2 ring-yellow-400' : ''
                    } ${unlocked ? '' : 'opacity-80'}`}
                    style={{
                      borderColor: 'var(--accent)',
                      background: 'var(--panel)',
                      color: 'var(--text)',
                    }}
                  >
                    <div>{wp.name}</div>
                    <div className="text-xs opacity-80">
                      {unlocked ? (selected ? 'Selected' : 'Select') : `Buy: ${wp.price} 💰`}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </GlowModal>
    </div>
  )
}