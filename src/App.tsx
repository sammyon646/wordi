// src/App.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Trophy, Users, DollarSign, Settings, X, Lightbulb } from 'lucide-react'
import canvasConfetti from 'canvas-confetti'
import useGameStore from './store/useGameStore'
import Crossword from '@jaredreisinger/react-crossword'
import { ThemeProvider } from 'styled-components'
import { puzzles } from './data/puzzles'

const theme = {
  columnBreakpoint: '9999px',
  gridBackground: 'transparent',
  cellBackground: '#7c3aed',
  cellBorder: '#a78bfa',
  textColor: 'white',
  numberColor: 'rgba(255,255,255,0.6)',
  focusBackground: '#fbbf24',
  highlightBackground: '#f59e0b',
}

export default function App() {
  const { wordPoints, level, currentPuzzleIndex, addWordPoints, nextPuzzle, levelUp, setPuzzleCorrect } = useGameStore()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const currentPuzzle = puzzles[currentPuzzleIndex]

  const handleComplete = (correct: boolean) => {
    if (correct && !useGameStore.getState().isPuzzleCorrect) {
      setPuzzleCorrect(true)
      addWordPoints(200 + level * 50)
      canvasConfetti({ particleCount: 250, spread: 90, origin: { y: 0.6 } })
      setShowLevelUp(true)
      setTimeout(() => {
        setShowLevelUp(false)
        levelUp()
        nextPuzzle()
      }, 2000)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black text-white flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-yellow-400">{wordPoints}</div>
            <span className="text-sm opacity-80">points</span>
          </div>

          <button
            onClick={() => setShowHint(true)}
            className="bg-purple-700/60 px-5 py-2 rounded-full flex items-center gap-2"
          >
            <Lightbulb className="w-6 h-6" /> Hint
          </button>

          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold">Level {level}</span>
          </div>
        </div>

        {/* Crossword */}
        <div className="flex-1 overflow-auto px-4 pb-20">
          <Crossword data={currentPuzzle} onCrosswordCorrect={handleComplete} />
        </div>

        {/* Hint Modal */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
              onClick={() => setShowHint(false)}
            >
              <motion.div
                className="bg-purple-900 rounded-3xl p-10 text-center max-w-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-6xl mb-6">Hint</div>
                <p className="text-lg mb-8">Words intersect at shared letters!</p>
                <button
                  onClick={() => setShowHint(false)}
                  className="bg-yellow-400 text-black px-10 py-4 rounded-full text-xl font-bold"
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
              <motion.div
                className="text-8xl font-bold text-yellow-400 drop-shadow-2xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1.4, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 1.8, type: "spring" }}
              >
                Level Up!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 flex justify-around py-4">
          <button className="flex flex-col items-center">
            <Trophy className="w-7 h-7 mb-1" />
            <span className="text-xs">Boost</span>
          </button>
          <button className="flex flex-col items-center">
            <Users className="w-7 h-7 mb-1" />
            <span className="text-xs">Friends</span>
          </button>
          <button className="flex flex-col items-center">
            <DollarSign className="w-7 h-7 mb-1" />
            <span className="text-xs">Earn</span>
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center">
            <Settings className="w-7 h-7 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>

        {/* Settings Modal (пусто, но красиво) */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
              onClick={() => setIsSettingsOpen(false)}
            >
              <motion.div
                className="bg-purple-900 rounded-2xl p-10 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Settings</h2>
                  <button onClick={() => setIsSettingsOpen(false)}>
                    <X className="w-8 h-8" />
                  </button>
                </div>
                <p className="text-lg opacity-70">More options coming soon!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}