'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import type { LOVE_LETTERS } from '@/config/content'

type Letter = (typeof LOVE_LETTERS)[number]

interface LetterCardProps {
  letter:    Letter
  rotation?: number
}

export function LetterCard({ letter, rotation = 0 }: LetterCardProps) {
  const [open, setOpen]  = useState(false)
  const reduced          = useReducedMotion()
  const isBodyPending    = letter.body.startsWith('[')
  const isPreviewPending = letter.preview.startsWith('[')

  return (
    <motion.div
      style={{ rotate: reduced ? 0 : rotation }}
      whileHover={reduced ? {} : { scale: 1.015, rotate: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="cursor-pointer"
      onClick={() => setOpen(v => !v)}
    >
      {/* Card face */}
      <div className="bg-ivory border border-gold/20 rounded-sm p-6 shadow-[0_4px_24px_rgba(35,22,34,0.06)]">
        {/* Gold top rule */}
        <div className="w-8 h-px bg-gold/40 mb-5" aria-hidden="true" />

        <p className="font-script italic text-plum/35 text-[11px] tracking-[0.12em] mb-3">
          To {letter.to}, with love
        </p>
        <p className="font-display text-xl text-plum mb-1">
          From {letter.from}
        </p>
        {!letter.date.startsWith('[') && (
          <p className="font-sans text-[10px] tracking-widest uppercase text-plum/25 mb-4">
            {letter.date}
          </p>
        )}

        <p className="font-script italic text-plum/55 text-sm leading-relaxed line-clamp-2 mb-4">
          {isPreviewPending ? 'A letter is being written…' : letter.preview}
        </p>

        <p className="font-sans text-[10px] tracking-[0.16em] uppercase text-gold/45">
          {open ? 'Close ↑' : 'Read letter ↓'}
        </p>
      </div>

      {/* Expanded body */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="body"
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-ivory/90 border border-gold/15 border-t-0 rounded-b-sm px-6 pb-6 pt-4">
              <p className="font-script italic text-plum/65 text-sm leading-relaxed whitespace-pre-wrap">
                {isBodyPending
                  ? "This letter hasn't been written yet — but it's going to be beautiful."
                  : letter.body}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
