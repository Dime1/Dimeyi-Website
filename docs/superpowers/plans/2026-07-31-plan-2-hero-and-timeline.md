# Hero + Our Story Timeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the animated hero section (starfield canvas, name reveal, astrolabe countdown, scroll cue) and the scroll-triggered Our Story timeline (10 milestone cards with constellation thread and scripture strip).

**Architecture:** Feature-based. Hero features live in `features/hero/`, timeline features in `features/timeline/`. A `useParticles` hook owns the canvas RAF loop and is imported by `StarfieldCanvas`. Framer Motion `whileInView` drives scroll-triggered card reveals. `ConstellationThread` provides the decorative left-side vertical line; each `MilestoneCard` renders its own dot node. `AstrolabeCountdown` is a pure SVG/timer component with no external deps.

**Tech Stack:** Next.js App Router, Framer Motion (motion, useScroll, useTransform, AnimatePresence), Tailwind CSS v4, `next/image`, Vitest + React Testing Library

---

## File Map

| File | Responsibility |
|------|---------------|
| `lib/hooks/useParticles.ts` | RAF loop for starfield — draws stars on canvas, reduced-motion aware |
| `features/hero/StarfieldCanvas.tsx` | Canvas element + useParticles wiring |
| `features/hero/AstrolabeCountdown.tsx` | Live SVG dial countdown to Feb 18, 2027 |
| `features/hero/HeroSection.tsx` | Full hero: canvas bg, name reveal, verse watermark, countdown, scroll cue, video slot |
| `features/timeline/ConstellationThread.tsx` | Decorative gradient thread line (left side of timeline) |
| `features/timeline/MilestoneCard.tsx` | Single scroll-triggered story chapter card |
| `features/timeline/TimelineSection.tsx` | All 10 cards + thread + scripture strip |
| `app/page.tsx` | Wire HeroSection |
| `app/our-story/page.tsx` | Wire TimelineSection |
| `vitest.setup.ts` | Add IntersectionObserver mock (required for whileInView in tests) |
| `__tests__/features/hero/AstrolabeCountdown.test.tsx` | 3 tests: renders day count, aria-label, HH:MM:SS |
| `__tests__/features/timeline/MilestoneCard.test.tsx` | 4 tests: chapter, title, date, body, placeholder photo |
| `__tests__/features/timeline/TimelineSection.test.tsx` | 3 tests: all 10 chapters present, scripture verse present |

---

### Task 1: Particle hook and StarfieldCanvas

**Files:**
- Create: `lib/hooks/useParticles.ts`
- Create: `features/hero/StarfieldCanvas.tsx`

No TDD for canvas — `HTMLCanvasElement` is not testable in jsdom.

- [ ] **Step 1: Create the useParticles hook**

Create `lib/hooks/useParticles.ts`:
```ts
'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface Star {
  x:       number
  y:       number
  r:       number
  opacity: number
  speed:   number
  phase:   number
}

export function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  count = 100,
) {
  const reduced  = useReducedMotion()
  const starsRef = useRef<Star[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Use fewer particles on low-power devices
    const effectiveCount = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4)
      ? Math.floor(count / 2)
      : count

    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      starsRef.current = Array.from({ length: effectiveCount }, () => ({
        x:       Math.random() * canvas!.width,
        y:       Math.random() * canvas!.height,
        r:       Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.55 + 0.15,
        speed:   Math.random() * 0.4 + 0.05,
        phase:   Math.random() * Math.PI * 2,
      }))
    }

    function draw(time: number) {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of starsRef.current) {
        const twinkle = reduced
          ? s.opacity
          : s.opacity * (0.65 + 0.35 * Math.sin(time * 0.001 * s.speed + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(251,246,240,${twinkle})`
        ctx.fill()
      }
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    if (reduced) {
      draw(0)
      return () => ro.disconnect()
    }

    let raf: number
    function tick(time: number) {
      draw(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [canvasRef, count, reduced])
}
```

- [ ] **Step 2: Create StarfieldCanvas**

Create `features/hero/StarfieldCanvas.tsx`:
```tsx
'use client'

import { useRef } from 'react'
import { useParticles } from '@/lib/hooks/useParticles'

interface StarfieldCanvasProps {
  count?: number
}

export function StarfieldCanvas({ count = 100 }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useParticles(canvasRef, count)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/useParticles.ts features/hero/StarfieldCanvas.tsx
git commit -m "feat: add useParticles hook and StarfieldCanvas with RAF starfield animation"
```

---

### Task 2: AstrolabeCountdown (TDD)

**Files:**
- Create: `__tests__/features/hero/AstrolabeCountdown.test.tsx`
- Create: `features/hero/AstrolabeCountdown.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/features/hero/AstrolabeCountdown.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AstrolabeCountdown } from '@/features/hero/AstrolabeCountdown'

describe('AstrolabeCountdown', () => {
  it('renders a DAYS label', () => {
    render(<AstrolabeCountdown />)
    expect(screen.getByText('DAYS')).toBeInTheDocument()
  })

  it('has an accessible aria-label mentioning days', () => {
    const { container } = render(<AstrolabeCountdown />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-label')).toMatch(/days/)
  })

  it('renders an HH:MM:SS time display', () => {
    render(<AstrolabeCountdown />)
    // Should contain colon-separated time segments like "00 : 00 : 00"
    const timeEl = screen.getByRole('timer')
    expect(timeEl).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- --reporter=verbose 2>&1 | tail -20
```

Expected: FAIL — `Cannot find module '@/features/hero/AstrolabeCountdown'`

- [ ] **Step 3: Implement AstrolabeCountdown**

Create `features/hero/AstrolabeCountdown.tsx`:
```tsx
'use client'

import { useEffect, useState } from 'react'
import { WEDDING } from '@/config/content'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface TimeLeft {
  days:    number
  hours:   number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, WEDDING.date.getTime() - Date.now())
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const SIZE   = 220
const CX     = 110
const CY     = 110
const R      = 88

// 60 tick marks — 12 major (every 5) + 48 minor
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const angle  = (i * 6 - 90) * (Math.PI / 180)
  const major  = i % 5 === 0
  const inner  = major ? R - 10 : R - 5
  return {
    x1: CX + inner * Math.cos(angle),
    y1: CY + inner * Math.sin(angle),
    x2: CX + R * Math.cos(angle),
    y2: CY + R * Math.sin(angle),
    major,
  }
})

export function AstrolabeCountdown() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [reduced])

  // Pointer rotates through a full circle each day (based on seconds elapsed today)
  const secondsInDay = 86400
  const secondsToday = (Date.now() / 1000) % secondsInDay
  const pointerAngle = reduced ? 0 : (secondsToday / secondsInDay) * 360

  const ariaLabel = `${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds until the wedding`

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-label={ariaLabel}
        role="img"
      >
        {/* Outer ring */}
        <circle cx={CX} cy={CY} r={R}      fill="none" stroke="#C9A24B" strokeWidth="0.5" opacity="0.35"/>
        <circle cx={CX} cy={CY} r={R - 14} fill="none" stroke="#C9A24B" strokeWidth="0.25" opacity="0.15"/>

        {/* Tick marks */}
        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="#C9A24B"
            strokeWidth={t.major ? 0.8 : 0.4}
            opacity={t.major ? 0.45 : 0.2}
          />
        ))}

        {/* Cross-hairs */}
        {[[CX, CY - R + 20, CX, CY - 48], [CX + 48, CY, CX + R - 20, CY],
          [CX, CY + 48, CX, CY + R - 20], [CX - R + 20, CY, CX - 48, CY]].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#C9A24B" strokeWidth="0.3" opacity="0.12" />
        ))}

        {/* Pointer hand */}
        <g transform={`rotate(${pointerAngle}, ${CX}, ${CY})`}>
          <line
            x1={CX} y1={CY}
            x2={CX} y2={CY - R + 18}
            stroke="#C9A24B" strokeWidth="0.8" opacity="0.55" strokeLinecap="round"
          />
          <circle cx={CX} cy={CY - R + 18} r="2" fill="#C9A24B" opacity="0.6"/>
        </g>

        {/* Center dot */}
        <circle cx={CX} cy={CY} r="3" fill="#C9A24B" opacity="0.8"/>

        {/* Day count */}
        <text
          x={CX} y={CY - 8}
          textAnchor="middle" dominantBaseline="middle"
          fill="#FBF6F0" fontSize="34"
          fontFamily="var(--font-display)" fontWeight="700" opacity="0.9"
          aria-hidden="true"
        >
          {time.days}
        </text>

        {/* DAYS label */}
        <text
          x={CX} y={CY + 17}
          textAnchor="middle" dominantBaseline="middle"
          fill="#C9A24B" fontSize="7"
          fontFamily="var(--font-sans)" fontWeight="500" letterSpacing="0.18em"
          opacity="0.55"
        >
          DAYS
        </text>
      </svg>

      {/* HH:MM:SS */}
      <p
        role="timer"
        aria-label={`${time.hours} hours ${time.minutes} minutes ${time.seconds} seconds`}
        className="font-sans text-[11px] tracking-[0.22em] text-gold/35 tabular-nums"
        aria-hidden="false"
      >
        {String(time.hours).padStart(2,'0')} : {String(time.minutes).padStart(2,'0')} : {String(time.seconds).padStart(2,'0')}
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- --reporter=verbose 2>&1 | tail -20
```

Expected: 13 PASS (10 from Plan 1 + 3 new), 0 FAIL

- [ ] **Step 5: Commit**

```bash
git add features/hero/AstrolabeCountdown.tsx __tests__/features/hero/AstrolabeCountdown.test.tsx
git commit -m "feat: add AstrolabeCountdown SVG dial with live countdown to Feb 18 2027 (TDD, 3 tests)"
```

---

### Task 3: HeroSection and wire home page

**Files:**
- Create: `features/hero/HeroSection.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create HeroSection**

Create `features/hero/HeroSection.tsx`:
```tsx
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { StarfieldCanvas }      from '@/features/hero/StarfieldCanvas'
import { AstrolabeCountdown }   from '@/features/hero/AstrolabeCountdown'
import { useReducedMotion }     from '@/lib/hooks/useReducedMotion'
import { COUPLE, VERSES, WEDDING } from '@/config/content'

// Stagger letters of the display name
const DISPLAY_NAME = COUPLE.displayNames  // "Feyisogo & Dimeji"
const CHARS = DISPLAY_NAME.split('')

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.4 }
  },
}

const charVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // Verse opacity fades from 0.3 → 0 as the hero section scrolls out
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
```

- [ ] **Step 2: Wire home page**

Replace `app/page.tsx`:
```tsx
import { HeroSection } from '@/features/hero/HeroSection'

export default function HomePage() {
  return <HeroSection />
}
```

- [ ] **Step 3: Commit**

```bash
git add features/hero/HeroSection.tsx app/page.tsx
git commit -m "feat: add HeroSection with starfield, name reveal animation, verse watermark, countdown, scroll cue"
```

---

### Task 4: MilestoneCard (TDD)

**Files:**
- Modify: `vitest.setup.ts`
- Create: `__tests__/features/timeline/MilestoneCard.test.tsx`
- Create: `features/timeline/MilestoneCard.tsx`

- [ ] **Step 1: Mock IntersectionObserver in vitest.setup.ts**

Framer Motion's `whileInView` uses `IntersectionObserver` which doesn't exist in jsdom. Add the mock.

Open `vitest.setup.ts` and replace the entire file with:
```ts
import '@testing-library/jest-dom'

// Framer Motion's whileInView uses IntersectionObserver; mock it for jsdom
class MockIntersectionObserver {
  observe()    {}
  unobserve()  {}
  disconnect() {}
}
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable:     true,
  configurable: true,
  value:        MockIntersectionObserver,
})
```

- [ ] **Step 2: Write failing tests**

Create `__tests__/features/timeline/MilestoneCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MilestoneCard } from '@/features/timeline/MilestoneCard'
import { STORY_MILESTONES } from '@/config/content'

describe('MilestoneCard', () => {
  const milestone = STORY_MILESTONES[0]  // Chapter One

  it('renders the chapter label', () => {
    render(<MilestoneCard milestone={milestone} index={0} />)
    expect(screen.getByText('Chapter One')).toBeInTheDocument()
  })

  it('renders the milestone title', () => {
    render(<MilestoneCard milestone={milestone} index={0} />)
    expect(screen.getByText('A Hello That Changed Everything')).toBeInTheDocument()
  })

  it('renders the date', () => {
    render(<MilestoneCard milestone={milestone} index={0} />)
    expect(screen.getByText(/April 2018/)).toBeInTheDocument()
  })

  it('renders the body text', () => {
    render(<MilestoneCard milestone={milestone} index={0} />)
    expect(screen.getByText(/Covenant University/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests — confirm they fail**

```bash
npm run test:run -- --reporter=verbose 2>&1 | tail -20
```

Expected: FAIL — `Cannot find module '@/features/timeline/MilestoneCard'`

- [ ] **Step 4: Implement MilestoneCard**

Create `features/timeline/MilestoneCard.tsx`:
```tsx
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
          <div className="aspect-[4/3] w-full max-w-sm bg-plum/8 rounded-sm border border-gold/8 mb-5 flex items-center justify-center">
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
```

- [ ] **Step 5: Run tests — confirm they pass**

```bash
npm run test:run -- --reporter=verbose 2>&1 | tail -20
```

Expected: 17 PASS (13 before + 4 new), 0 FAIL

- [ ] **Step 6: Commit**

```bash
git add vitest.setup.ts features/timeline/MilestoneCard.tsx __tests__/features/timeline/MilestoneCard.test.tsx
git commit -m "feat: add MilestoneCard with scroll-triggered animation (TDD, 4 tests); mock IntersectionObserver"
```

---

### Task 5: ConstellationThread

**Files:**
- Create: `features/timeline/ConstellationThread.tsx`

No tests required — purely presentational with no logic.

- [ ] **Step 1: Create ConstellationThread**

Create `features/timeline/ConstellationThread.tsx`:
```tsx
interface ConstellationThreadProps {
  className?: string
}

export function ConstellationThread({ className = '' }: ConstellationThreadProps) {
  return (
    <div
      className={`absolute left-[15px] inset-y-4 w-px pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        background:
          'linear-gradient(to bottom, transparent 0%, rgba(201,162,75,0.25) 8%, rgba(201,162,75,0.22) 92%, transparent 100%)',
      }}
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/timeline/ConstellationThread.tsx
git commit -m "feat: add ConstellationThread decorative gradient vertical thread"
```

---

### Task 6: TimelineSection (TDD) + wire Our Story page

**Files:**
- Create: `__tests__/features/timeline/TimelineSection.test.tsx`
- Create: `features/timeline/TimelineSection.tsx`
- Modify: `app/our-story/page.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/features/timeline/TimelineSection.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineSection } from '@/features/timeline/TimelineSection'
import { STORY_MILESTONES, VERSES } from '@/config/content'

describe('TimelineSection', () => {
  it('renders all 10 chapter labels', () => {
    render(<TimelineSection />)
    for (const m of STORY_MILESTONES) {
      expect(screen.getByText(m.chapter)).toBeInTheDocument()
    }
  })

  it('renders the mid-timeline scripture verse text', () => {
    render(<TimelineSection />)
    // VERSES.timeline contains the mid-timeline verse
    expect(screen.getByText(VERSES.timeline.text)).toBeInTheDocument()
  })

  it('renders the page heading', () => {
    render(<TimelineSection />)
    expect(screen.getByRole('heading', { name: /our story/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run -- --reporter=verbose 2>&1 | tail -20
```

Expected: FAIL — `Cannot find module '@/features/timeline/TimelineSection'`

- [ ] **Step 3: Implement TimelineSection**

Create `features/timeline/TimelineSection.tsx`:
```tsx
import { STORY_MILESTONES, VERSES } from '@/config/content'
import { MilestoneCard }        from '@/features/timeline/MilestoneCard'
import { ConstellationThread }  from '@/features/timeline/ConstellationThread'
import { ScriptureStrip }       from '@/components/ui/ScriptureStrip'

// Insert the scripture strip after this milestone index (0-based)
const SCRIPTURE_AFTER_INDEX = 4  // after Ch. 5 "Building Something Real"

export function TimelineSection() {
  return (
    <section className="relative max-w-3xl mx-auto px-6 py-32">
      {/* Section heading */}
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Our Story
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-20">
        Ten chapters · One forever
      </p>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Thread line */}
        <ConstellationThread />

        {/* Milestone cards with mid-timeline scripture break */}
        {STORY_MILESTONES.map((milestone, i) => (
          <div key={milestone.id}>
            <MilestoneCard milestone={milestone} index={i} />

            {/* Scripture strip inserted after the 5th chapter */}
            {i === SCRIPTURE_AFTER_INDEX && (
              <div className="pl-0 -ml-8 my-8">
                <ScriptureStrip
                  text={VERSES.timeline.text}
                  reference={VERSES.timeline.ref}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm run test:run -- --reporter=verbose 2>&1 | tail -20
```

Expected: 20 PASS (17 before + 3 new), 0 FAIL

- [ ] **Step 5: Wire Our Story page**

Replace `app/our-story/page.tsx`:
```tsx
import { TimelineSection } from '@/features/timeline/TimelineSection'

export default function OurStoryPage() {
  return <TimelineSection />
}
```

- [ ] **Step 6: Commit**

```bash
git add features/timeline/TimelineSection.tsx __tests__/features/timeline/TimelineSection.test.tsx app/our-story/page.tsx
git commit -m "feat: add TimelineSection with 10 chapters, constellation thread, mid-timeline verse (TDD, 3 tests)"
```

---

### Task 7: Build verification and visual check

**Files:** None

- [ ] **Step 1: Run full test suite**

```bash
npm run test:run -- --reporter=verbose
```

Expected: **20 PASS, 0 FAIL**

Tests breakdown:
- `gate.test.ts`: 6 tests
- `GatedPage.test.tsx`: 4 tests
- `AstrolabeCountdown.test.tsx`: 3 tests
- `MilestoneCard.test.tsx`: 4 tests
- `TimelineSection.test.tsx`: 3 tests

- [ ] **Step 2: Production build check**

```bash
npm run build 2>&1 | tail -30
```

Expected: All pages compile without errors. `✓ Generating static pages` with 13 routes.

- [ ] **Step 3: Start dev server and verify hero visually**

```bash
npm run dev
```

Open http://localhost:3000. Verify:

- [ ] Full-screen dark (`bg-plum`) hero section visible
- [ ] Starfield particles slowly twinkling in the background
- [ ] Couple name "Feyisogo & Dimeji" traces in letter-by-letter with the `&` in gold
- [ ] "February 18, 2027" fades in below the names ~1.6s after load
- [ ] Astrolabe countdown visible below names: day count number in centre, `DAYS` label, `HH : MM : SS` below the dial, rotating pointer
- [ ] Scroll down — verse watermark fades out
- [ ] Glowing chevron scroll cue pulses at bottom
- [ ] Navigate to `/our-story`: 10 milestone chapters listed with left thread line visible
- [ ] Cards fade + rise in as you scroll down the timeline
- [ ] Scripture strip appears between Chapter 5 and Chapter 6
- [ ] Photo placeholders shown as subtle "Photo coming soon" boxes

- [ ] **Step 4: Final commit (if any tweaks were needed)**

```bash
git add -p  # stage only intentional tweaks
git commit -m "fix: visual tweaks from Plan 2 dev review"
```

(Skip this commit if no tweaks were needed.)

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered in task |
|-----------------|----------------|
| Animated canvas starfield (low density, GPU-cheap) | Task 1 |
| Auto-throttle particles on low-power devices | Task 1 (hardwareConcurrency check) |
| `prefers-reduced-motion` on all animations | Tasks 1, 2, 3, 4 |
| Video `<slot>` wired but hidden | Task 3 |
| Couple names: Playfair Display + slow cinematic reveal | Task 3 |
| `&` character in gold | Task 3 |
| Verse watermark fades on scroll | Task 3 |
| `AstrolabeCountdown` styled as star-dial, not digital clock | Task 2 |
| Scroll cue (glowing chevron) | Task 3 |
| Vertical scroll-triggered timeline — 10 chapters | Task 6 |
| Chapter 3 blank placeholder preserved | Tasks 4, 6 (body renders `[CHAPTER_3_BODY]`) |
| MilestoneCard: fade + rise on scroll | Task 4 |
| Photo: `next/image` or placeholder box | Task 4 |
| ConstellationThread SVG connects nodes | Task 5 |
| Scripture callout mid-timeline (Ecclesiastes 4:12) | Task 6 |
| Lenis smooth scroll (existing) works with timeline | No change needed — LenisProvider wraps app |

**Type consistency:**
- `Milestone` type inferred from `typeof STORY_MILESTONES[number]` — consistent across MilestoneCard and TimelineSection.
- `VERSES.timeline` from `config/content.ts` used in TimelineSection tests and implementation — consistent.

**No placeholders in steps** — all code is complete.
