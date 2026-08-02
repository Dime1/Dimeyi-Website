'use client'

import { useRef, useState } from 'react'
import Image                 from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useReducedMotion }  from '@/lib/hooks/useReducedMotion'
import type { StoryMovement } from '@/config/content'

interface StoryMovementProps {
  movement:   StoryMovement
  index:      number
  verseText?: string
  verseRef?:  string
}

const ROMAN = ['I', 'II', 'III']

const PALETTE = {
  friendship: {
    fragment:    'text-rose',
    placeholder: 'from-blush via-rose/20 to-blush/60',
    btn:         'border-rose/40 text-rose hover:border-rose hover:bg-rose/10',
    btnOpen:     'border-rose text-rose bg-rose/15',
  },
  dating: {
    fragment:    'text-lilac',
    placeholder: 'from-indigo/20 via-lilac/15 to-indigo/10',
    btn:         'border-lilac/40 text-lilac hover:border-lilac hover:bg-lilac/10',
    btnOpen:     'border-lilac text-lilac bg-lilac/15',
  },
  proposal: {
    fragment:    'text-gold',
    placeholder: 'from-gold/15 via-blush/20 to-gold/10',
    btn:         'border-gold/40 text-gold hover:border-gold hover:bg-gold/10',
    btnOpen:     'border-gold text-gold bg-gold/15',
  },
} as const

export function StoryMovement({ movement, index, verseText, verseRef }: StoryMovementProps) {
  const ref     = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [56, -56])
  const textY  = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-24, 24])

  const imageLeft  = index % 2 === 0
  const isProposal = movement.variant === 'proposal'
  const roman      = ROMAN[index] ?? String(index + 1)
  const palette    = PALETTE[movement.variant]

  const hasHero = !movement.heroPhoto.startsWith('[')
  const auxReal = (movement.auxPhotos as readonly string[]).filter(p => !p.startsWith('['))

  /* ── hero image ────────────────────────────────────── */
  const heroBlock = (
    <motion.div style={{ y: imageY }} className="relative">
      <div
        className={[
          'relative overflow-hidden rounded-2xl ring-1 ring-gold/15',
          isProposal ? 'aspect-[3/4]' : 'aspect-[4/3]',
        ].join(' ')}
        style={{
          boxShadow:
            '0 0 0 1px rgba(201,162,75,0.10), 0 8px 64px rgba(201,162,75,0.12), 0 0 140px rgba(201,162,75,0.06)',
          transform: isProposal ? 'none' : imageLeft ? 'rotate(0.4deg)' : 'rotate(-0.4deg)',
        }}
      >
        {hasHero ? (
          <Image
            src={movement.heroPhoto}
            alt={movement.title}
            fill
            className={`${movement.variant === 'friendship' ? 'object-contain' : 'object-cover'}${!reduced ? ' animate-breathe' : ''}`}
            sizes={isProposal
              ? '(max-width: 768px) 100vw, 55vw'
              : '(max-width: 768px) 100vw, 50vw'
            }
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${palette.placeholder} flex items-center justify-center`}>
            <span className="font-sans text-[10px] tracking-[0.26em] uppercase text-plum/25">
              Coming soon
            </span>
          </div>
        )}

        {/* Scripture watermark behind the hero image */}
        {verseText && (
          <div className="absolute inset-0 flex items-end justify-center p-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
            <p className="font-script italic text-xs text-white/20 text-center leading-relaxed max-w-[80%]">
              {verseText}
            </p>
          </div>
        )}
      </div>

      {/* Aux photos — loose offset arrangement below hero */}
      {auxReal.length > 0 && (
        <div className="flex gap-3 mt-4">
          {auxReal.map((src, pi) => (
            <div
              key={pi}
              className={[
                'relative flex-1 overflow-hidden rounded-xl ring-1 ring-gold/10',
                pi === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]',
                pi === 1 ? 'translate-y-6' : '',
              ].join(' ')}
              style={{ boxShadow: '0 4px 32px rgba(201,162,75,0.08)' }}
            >
              <Image
                src={src}
                alt={movement.title}
                fill
                className={`object-cover${!reduced ? ' animate-breathe' : ''}`}
                sizes="20vw"
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )

  /* ── text block ─────────────────────────────────────── */
  const textBlock = (
    <motion.div style={{ y: textY }} className="flex flex-col justify-center relative">
      {/* Period */}
      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0 }}
        className="font-sans text-sm font-medium tracking-[0.22em] uppercase text-plum/90 mb-3"
      >
        {movement.period}
      </motion.p>

      {/* Fragment sequence — each reveals in turn */}
      <div className="space-y-2 mb-4">
        {movement.fragments.map((fragment, fi) => (
          <motion.p
            key={fi}
            initial={reduced ? false : { opacity: 0, x: imageLeft ? 20 : -20, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 + fi * 0.15 }}
            className={`font-script italic font-bold leading-snug ${palette.fragment} ${isProposal ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}
          >
            {fragment}
          </motion.p>
        ))}
      </div>

      {/* Title */}
      <motion.h2
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className={`font-display text-plum leading-tight mb-5 ${isProposal ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}
      >
        {movement.title}
      </motion.h2>

      {/* Expand / unfold */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <motion.button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          whileHover={reduced ? {} : { scale: 1.04, y: -1 }}
          whileTap={reduced  ? {} : { scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border font-sans text-xs tracking-[0.14em] uppercase font-semibold transition-all duration-200 cursor-pointer select-none mb-3 ${open ? palette.btnOpen : palette.btn}`}
        >
          <span>{open ? 'Close' : 'Unfold the memory'}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="leading-none"
          >
            ↓
          </motion.span>
        </motion.button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="font-calligraphy italic font-bold text-base text-plum/90 leading-relaxed pt-1 text-center">
                {movement.body}
              </p>
              {verseText && verseRef && (
                <blockquote className="mt-5 border-l-2 border-gold/30 pl-4">
                  <p className="font-script italic text-base text-plum/80 leading-relaxed">
                    {verseText}
                  </p>
                  <cite className="font-sans not-italic text-sm tracking-[0.18em] uppercase text-plum/75 mt-1 block">
                    — {verseRef}
                  </cite>
                </blockquote>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )

  /* ── layout ─────────────────────────────────────────── */
  return (
    <motion.article
      ref={ref}
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-14 ${isProposal ? 'py-8 md:py-12' : 'py-6 md:py-8'}`}
    >
      {/* Faint Roman numeral — depth element, not a label */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        <span
          className={`font-display leading-none text-plum/[0.028] ${imageLeft ? 'ml-auto pr-6' : 'pl-6'}`}
          style={{ fontSize: 'clamp(120px, 28vw, 320px)' }}
        >
          {roman}
        </span>
      </div>

      {/* Content layers above numeral */}
      {imageLeft ? (
        <>
          <div className="relative z-10 w-full md:w-[54%]">{heroBlock}</div>
          <div className="relative z-10 w-full md:w-[46%]">{textBlock}</div>
        </>
      ) : (
        <>
          <div className="relative z-10 w-full md:w-[46%] md:order-first">{textBlock}</div>
          <div className="relative z-10 w-full md:w-[54%] md:order-last">{heroBlock}</div>
        </>
      )}
    </motion.article>
  )
}
