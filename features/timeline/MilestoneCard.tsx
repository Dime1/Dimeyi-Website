'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import type { STORY_MILESTONES } from '@/config/content'

type Milestone = (typeof STORY_MILESTONES)[number]

interface MilestoneCardProps {
  milestone: Milestone
  index:     number
}

export function MilestoneCard({ milestone, index }: MilestoneCardProps) {
  const reduced = useReducedMotion()
  const hasPhoto = !milestone.photo.startsWith('[')

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: index % 2 === 0 ? 0 : 0.1 }}
      className="relative pl-9 pb-16 last:pb-0"
    >
      {/* Thread node dot */}
      <div
        className="absolute left-0 top-[22px] w-2.5 h-2.5 -translate-x-[5px] rounded-full border border-gold/50 bg-plum"
        aria-hidden="true"
      />

      {/* Card content */}
      <div className="max-w-2xl">
        {/* Chapter label */}
        <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-gold/45 mb-1">
          {milestone.chapter}
        </p>

        {/* Title */}
        <h2 className="font-display text-2xl md:text-3xl text-plum leading-snug mb-1">
          {milestone.title}
        </h2>

        {/* Date */}
        <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/30 mb-5">
          {milestone.date}
        </p>

        {/* Photo */}
        {hasPhoto ? (
          <div className="relative aspect-[4/3] w-full max-w-sm rounded-sm overflow-hidden mb-5 border border-gold/10">
            <Image
              src={milestone.photo}
              alt={milestone.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full max-w-sm bg-plum/10 rounded-sm border border-gold/10 mb-5 flex items-center justify-center">
            <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-gold/15">
              Photo coming soon
            </span>
          </div>
        )}

        {/* Body */}
        <p className="font-sans text-sm text-plum/65 leading-relaxed">
          {milestone.body}
        </p>
      </div>
    </motion.article>
  )
}
