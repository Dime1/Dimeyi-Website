'use client'
import { useState }              from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PolaroidCardProps {
  authorName: string
  message:    string
  rotation:   number
}

export function PolaroidCard({ authorName, message, rotation }: PolaroidCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="relative break-inside-avoid select-none cursor-pointer"
      style={{ rotate: rotation }}
      whileHover={!open ? { y: -4, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 360, damping: 24 }}
      onClick={() => setOpen(o => !o)}
    >
      {/* Perspective container — enables 3D flap fold */}
      <div className="relative w-full" style={{ aspectRatio: '8/5', perspective: '700px' }}>

        {/* ── Envelope body ─────────────────────────────── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            background: '#faf6ef',
            border: '1px solid rgba(201,162,75,0.38)',
            boxShadow: '0 4px 20px rgba(63,32,11,0.12), 0 1px 4px rgba(201,162,75,0.15)',
          }}
        >
          {/* Fold lines: X crease + left / right / bottom wing flaps */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 160 100"
            preserveAspectRatio="none"
          >
            {/* X crease */}
            <line x1="0"   y1="0"   x2="160" y2="100" stroke="rgba(201,162,75,0.13)" strokeWidth="0.8"/>
            <line x1="160" y1="0"   x2="0"   y2="100" stroke="rgba(201,162,75,0.13)" strokeWidth="0.8"/>
            {/* Left wing */}
            <path d="M0,0 L0,100 L80,50 Z"     fill="rgba(235,224,202,0.52)" stroke="rgba(201,162,75,0.2)" strokeWidth="0.6"/>
            {/* Right wing */}
            <path d="M160,0 L160,100 L80,50 Z" fill="rgba(235,224,202,0.52)" stroke="rgba(201,162,75,0.2)" strokeWidth="0.6"/>
            {/* Bottom flap */}
            <path d="M0,100 L160,100 L80,50 Z" fill="rgba(226,214,190,0.68)" stroke="rgba(201,162,75,0.26)" strokeWidth="0.6"/>
          </svg>

          {/* Letter content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-10">
            <AnimatePresence mode="wait">
              {!open ? (
                <motion.div
                  key="sealed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-center pt-4"
                >
                  <p className="font-sans text-[7px] tracking-[0.32em] uppercase text-plum/28 mb-0.5">To</p>
                  <p className="font-script italic text-plum/55 text-sm leading-snug">{authorName}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
                  className="text-center overflow-hidden"
                >
                  <p className="font-calligraphy italic text-[33px] text-plum/85 leading-relaxed mb-1.5">
                    {message}
                  </p>
                  <p className="font-script italic text-gold text-sm">— {authorName}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Top flap — peels back on open ─────────────── */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: '50%',
            transformOrigin: 'top center',
            transformPerspective: 700,
            backfaceVisibility: 'hidden',
          }}
          animate={{ rotateX: open ? -130 : 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="w-full h-full block">
            <defs>
              <linearGradient id="fg" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%"   stopColor="#f5edde"/>
                <stop offset="100%" stopColor="#e8d8be"/>
              </linearGradient>
            </defs>
            <path d="M0,0 L160,0 L80,100 Z" fill="url(#fg)" stroke="rgba(201,162,75,0.32)" strokeWidth="0.7"/>
          </svg>
        </motion.div>

        {/* ── Wax seal — breaks open on click ───────────── */}
        <motion.div
          className="absolute z-30 pointer-events-none"
          style={{ left: 'calc(50% - 22px)', top: 'calc(50% - 22px)' }}
          animate={{ scale: open ? 0 : 1, opacity: open ? 0 : 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 38% 30%, #e53e3e, #7f1d1d)',
              boxShadow:
                'inset 0 2px 5px rgba(0,0,0,0.35), inset 0 -1px 3px rgba(255,180,80,0.18), 0 3px 10px rgba(127,29,29,0.55), 0 0 0 1.5px rgba(185,28,28,0.65)',
            }}
          >
            <span
              className="text-white/95 leading-none"
              style={{ fontSize: '15px', textShadow: '0 1px 3px rgba(0,0,0,0.65)' }}
              aria-hidden="true"
            >
              ♥
            </span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
