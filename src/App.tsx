import { motion } from 'framer-motion'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 flex flex-col items-center justify-center text-center p-6">
      <motion.div
        className="text-7xl md:text-9xl font-bold text-yellow-400 drop-shadow-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        WORDI
      </motion.div>

      <motion.p
        className="text-2xl md:text-4xl text-white mt-8 opacity-90"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Готово! React + Vite + Tailwind работают
      </motion.p>

      <p className="text-lg text-yellow-300 mt-10">
        Теперь можно заливать настоящую игру со словами!
      </p>
    </div>
  )
}