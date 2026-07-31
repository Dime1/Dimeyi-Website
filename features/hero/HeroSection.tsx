'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { StarfieldCanvas }      from '@/features/hero/StarfieldCanvas'
import { AstrolabeCountdown }   from '@/features/hero/AstrolabeCountdown'
import { useReducedMotion }     from '@/lib/hooks/useReducedMotion'
import { COUPLE, VERSES, WEDDING } from '@/config/content'

const DISPLAY_NAME = COUPLE.displayNames
const CHARS = DISPLAY_NAME.split('')

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.4 }
  },
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target:  heroRef,
    offset: ['start start', 'end start'],
  })
  const verseOpacity = useTransform(scrollYProgress, [0, 0.7], [0.3, 0])

  return (
    <section
      ref={heroRef}
      className="relative h-screen bg-plum overflow-hidden"
      aria-label="Hero — Feyisogo and Dimeji"
    >
      {/* Starfield canvas */}
      <StarfieldCanvas count={100} />

      {/* Hidden video slot — add src when footage arrives */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
        aria-hidden="true"
        muted
        loop
        playsInline
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center gap-6 md:gap-8">

        {/* Verse watermark */}
        <motion.p
          style={{ opacity: reduced ? 0.2 : verseOpacity }}
          className="font-script italic text-gold/80 text-base md:text-lg max-w-md leading-relaxed"
          aria-label={`${VERSES.hero.text} — ${VERSES.hero.ref}`}
        >
          {VERSES.hero.text}
          <span className="block mt-1 font-sans font-medium text-[9px] tracking-[0.18em] uppercase text-gold/40 not-italic">
            {VERSES.hero.ref}
          </span>
        </motion.p>

        {/* Names */}
        <div>
          <motion.h1
            variants={containerVariants}
            initial={reduced ? 'show' : 'hidden'}
            animate="show"
            className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-ivory tracking-wide"
            aria-label={COUPLE.displayNames}
          >
            {CHARS.map((char, i) => (
              <motion.span
                key={i}
                variants={reduced ? {} : charVariants}
                aria-hidden="true"
                className={char === '&' ? 'text-gold' : ''}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Wedding date */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : { delay: 1.6, duration: 0.8 }}
            className="font-sans text-[11px] md:text-xs tracking-[0.22em] text-ivory/30 uppercase mt-3"
          >
            {WEDDING.dateLabel}
          </motion.p>
        </div>

        {/* Astrolabe countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduced ? { duration: 0 } : { delay: 2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <AstrolabeCountdown />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={reduced ? {} : {
            y:       [0, 7, 0],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7l5 5 5-5"
              stroke="#C9A24B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
