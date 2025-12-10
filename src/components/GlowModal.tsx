import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import React from 'react'

type GlowModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function GlowModal({ isOpen, onClose, title, children }: GlowModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="glow-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glow-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glow-header">
              {title && <h2 className="glow-title">{title}</h2>}
              <button className="glow-close" onClick={onClose}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="glow-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}