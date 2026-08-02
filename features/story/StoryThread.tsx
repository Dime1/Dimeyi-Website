'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export function StoryThread() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleY = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])

  return (
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 bottom-0 w-px hidden md:block pointer-events-none"
    >
      {/* Static dim baseline */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />

      {/* Animated drawn thread */}
      {!reduced && (
        <motion.div
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-gold/60 via-gold/35 to-gold/15"
          style={{ scaleY, height: '100%', transformOrigin: 'top' }}
        />
      )}

      {/* Constellation dots at top and bottom */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold/40" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold/40" />
    </div>
  )
}
