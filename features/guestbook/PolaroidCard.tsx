'use client'
import { useState }             from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PolaroidCardProps {
  authorName: string
  message:    string
  rotation:   number
}

export function PolaroidCard({ authorName, message, rotation }: PolaroidCardProps) {
  const [open,    setOpen]    = useState(false)
  const [shimmer, setShimmer] = useState(0)

  function handleClick() {
    if (!open) setShimmer(k => k + 1)
    setOpen(o => !o)
  }

  return (
    <div
      onClick={handleClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className="relative bg-white border border-gold/40 shadow-md p-3 pb-5 break-inside-avoid cursor-pointer transition-shadow hover:shadow-lg select-none overflow-hidden"
    >
      <AnimatePresence>
        {shimmer > 0 && (
          <motion.div
            key={shimmer}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            initial={{ x: '-100%' }}
            animate={{ x: '250%' }}
            exit={{}}
            transition={{ duration: 1.95, ease: 'easeInOut' }}
            style={{
              background:
                'linear-gradient(105deg, transparent 35%, rgba(201,162,75,0.45) 50%, rgba(255,255,255,0.6) 55%, transparent 65%)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-[60px] flex items-center justify-center py-1">
        {open ? (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="font-sans text-sm text-plum/85 leading-relaxed text-center"
          >
            {message}
          </motion.p>
        ) : (
          <span className="font-script italic text-plum/20 text-3xl" aria-hidden="true">♡</span>
        )}
      </div>

      <p className="font-script italic text-gold text-2xl font-bold text-center mt-2">
        — {authorName}
      </p>
    </div>
  )
}
