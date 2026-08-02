'use client'

import { motion }          from 'framer-motion'
import { STORY_MOVEMENTS } from '@/config/content'
import { StoryMovement }   from './StoryMovement'
import { StoryThread }     from './StoryThread'
import { StoryBackground } from './StoryBackground'

function isIncomplete(m: (typeof STORY_MOVEMENTS)[number]) {
  return (
    m.title.startsWith('[')  ||
    m.body.startsWith('[')   ||
    m.period.startsWith('[')
  )
}

function ChapterDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center gap-4 py-2 md:py-3"
      aria-hidden="true"
    >
      {/* Left arm */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="origin-right h-px w-32 md:w-56"
        style={{ background: 'linear-gradient(to left, rgba(201,162,75,0.55), transparent)' }}
      />

      {/* Central ornament */}
      <div className="relative flex items-center gap-2 shrink-0">
        <span className="block w-1 h-1 rounded-full bg-gold/40" />
        <svg
          width="18" height="18" viewBox="0 0 24 24"
          className="text-gold/70" fill="currentColor"
        >
          {/* 4-pointed star */}
          <path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z"/>
        </svg>
        <span className="block w-1 h-1 rounded-full bg-gold/40" />
      </div>

      {/* Right arm */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="origin-left h-px w-32 md:w-56"
        style={{ background: 'linear-gradient(to right, rgba(201,162,75,0.55), transparent)' }}
      />
    </motion.div>
  )
}

export function StorySection() {
  const visible = [...STORY_MOVEMENTS].filter(m => !isIncomplete(m))

  return (
    <section className="relative min-h-screen">
      <StoryBackground />

      <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-12" style={{ zIndex: 1 }}>

        {/* Page header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="font-display text-5xl md:text-7xl text-plum mb-4">
            Our Story
          </h1>
          <p className="font-sans text-sm tracking-[0.26em] uppercase text-plum/90">
            Written in the stars
          </p>
        </header>

        {/* Movements with connecting thread */}
        <div className="relative pl-0 md:pl-10">
          <StoryThread />

          <div className="relative" style={{ zIndex: 1 }}>
            {visible.map((movement, i) => (
              <div key={movement.id}>
                <StoryMovement
                  movement={movement}
                  index={i}
                  verseText={movement.verse.text}
                  verseRef={movement.verse.ref}
                />
                {i < visible.length - 1 && <ChapterDivider />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
