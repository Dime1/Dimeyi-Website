'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

/**
 * Three-phase ambient overlay:
 *   0→0.33  Friendship  — blush warmth rises gently
 *   0.33→0.66 Dating    — indigo deepens as tension builds
 *   0.66→1  Proposal    — resolves back to warm gold
 */
export function StoryBackground() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Blush — warm for friendship, fades out through dating
  const blushOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.40, 0.70, 1],
    [0,  0.06,  0.03,  0,    0],
  )

  // Indigo — deepens through dating, clears for proposal
  const indigoOpacity = useTransform(
    scrollYProgress,
    [0.20, 0.45, 0.65, 0.85, 1],
    [0,    0.06,  0.09,  0.04, 0],
  )

  // Gold — blooms for the proposal
  const goldOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.75, 1],
    [0,    0.05,  0.09],
  )

  if (reduced) return null

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <motion.div className="absolute inset-0 bg-blush"  style={{ opacity: blushOpacity  }} />
      <motion.div className="absolute inset-0 bg-indigo" style={{ opacity: indigoOpacity }} />
      <motion.div className="absolute inset-0 bg-gold"   style={{ opacity: goldOpacity   }} />
    </div>
  )
}
