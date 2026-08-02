# D-Day Page, Quiz Enhancements & Responsive Sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge Schedule + Travel into a single gated `/d-day` page, fix gallery labels, expand the quiz to 10 questions with body-scroll-lock, and apply a site-wide responsive sweep.

**Architecture:** Four independent task groups — gate/config changes come first (Task 1) so later tasks can import from stable types; D-Day route (Task 2) depends on Task 1; gallery/quiz fixes (Task 3) are self-contained; responsive sweep (Task 4) is purely additive Tailwind class changes.

**Tech Stack:** Next.js 15 App Router (server components + `'use client'`), TypeScript, Tailwind CSS, Vitest + Testing Library, Framer Motion

---

## File Map

**Create:**
- `app/d-day/page.tsx` — combined Schedule + Travel gated page

**Modify:**
- `config/reveal.ts` — rename `schedule`/`travel` keys → `'d-day'`
- `config/content.ts` — update NAV_LINKS (merge 2 entries → 1), add 5 quiz questions
- `next.config.ts` — add `/schedule` → `/d-day` and `/travel` → `/d-day` redirects
- `features/gallery/GalleryFilterTabs.tsx` — update two tab labels
- `features/quiz-widget/QuizWidgetButton.tsx` — body scroll lock + 70dvh
- `features/gallery/LightboxModal.tsx` — responsive close/padding
- `features/registry/RegistrySection.tsx` — responsive card widths
- `features/hero/AstrolabeCountdown.tsx` — responsive SVG wrapper
- `features/timeline/TimelineSection.tsx` — responsive padding
- `features/timeline/MilestoneCard.tsx` — minimum text sizes
- `app/gallery/page.tsx` — responsive padding + text-xs
- `app/rsvp/page.tsx` — text-xs subtitle
- `app/registry/page.tsx` — responsive padding + text-xs
- `app/guestbook/page.tsx` — responsive padding + text-xs
- `components/layout/Footer.tsx` — text-xs minimum sizes
- `__tests__/lib/gate.test.ts` — update page key from `'schedule'`/`'travel'` → `'d-day'`
- `__tests__/features/gallery/GalleryFilterTabs.test.tsx` — update label strings

**Delete:**
- `app/schedule/page.tsx`
- `app/travel/page.tsx`

---

## Task 1: Gate config & NAV_LINKS

**Files:**
- Modify: `config/reveal.ts`
- Modify: `config/content.ts` (NAV_LINKS only)
- Modify: `__tests__/lib/gate.test.ts`

- [ ] **Step 1: Update `config/reveal.ts`**

Replace both existing keys with a single `'d-day'` key:

```ts
export const UNLOCK_DATES = {
  'd-day': new Date('2026-11-20T00:00:00Z'),
} as const

export type GatedPage = keyof typeof UNLOCK_DATES
```

- [ ] **Step 2: Update NAV_LINKS in `config/content.ts`**

Replace the two gated entries (Schedule + Travel) with a single D-Day entry. The existing NAV_LINKS block currently reads:

```ts
export const NAV_LINKS = [
  { label: 'Our Story',         href: '/our-story',  gated: false },
  { label: 'Schedule',          href: '/schedule',   gated: true  },
  { label: 'Travel',            href: '/travel',     gated: true  },
  { label: 'RSVP',              href: '/rsvp',       gated: false },
  { label: 'Gallery',           href: '/gallery',    gated: false },
  { label: 'Ode to the Couple', href: '/guestbook',  gated: false },
  { label: 'Registry',          href: '/registry',   gated: false },
] as const
```

Change it to:

```ts
export const NAV_LINKS = [
  { label: 'Our Story',         href: '/our-story',  gated: false },
  { label: 'D-Day',             href: '/d-day',      gated: true  },
  { label: 'RSVP',              href: '/rsvp',       gated: false },
  { label: 'Gallery',           href: '/gallery',    gated: false },
  { label: 'Ode to the Couple', href: '/guestbook',  gated: false },
  { label: 'Registry',          href: '/registry',   gated: false },
] as const
```

- [ ] **Step 3: Update `__tests__/lib/gate.test.ts`**

Replace every occurrence of `'schedule'` and `'travel'` with `'d-day'`. The file currently has 8 calls to `getPageAccess`. Replace the entire file content:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { getPageAccess } from '@/lib/gate'

describe('getPageAccess', () => {
  afterEach(() => vi.useRealTimers())

  it('returns teaser state when current date is before unlock date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const result = getPageAccess('d-day')
    expect(result.state).toBe('teaser')
  })

  it('includes unlocksAt date when in teaser state', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const result = getPageAccess('d-day')
    expect(result.unlocksAt).toBeInstanceOf(Date)
  })

  it('returns partial state when date has passed but no rsvp', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('d-day')
    expect(result.state).toBe('partial')
  })

  it('returns partial state when date passed but rsvp is not_attending', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('d-day', 'not_attending')
    expect(result.state).toBe('partial')
  })

  it('returns full state when date passed and rsvp is attending', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('d-day', 'attending')
    expect(result.state).toBe('full')
  })

  it('returns partial state when date passed and no rsvp status provided', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('d-day', undefined)
    expect(result.state).toBe('partial')
  })
})
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npx vitest run __tests__/lib/gate.test.ts
```

Expected: 6 tests pass (was 8 — now 6 because we removed the travel-specific duplicates which tested identical behaviour)

- [ ] **Step 5: Commit**

```bash
git add config/reveal.ts config/content.ts __tests__/lib/gate.test.ts
git commit -m "feat: rename gate keys to d-day, update nav links"
```

---

## Task 2: D-Day route (new page + redirects + delete old pages)

**Files:**
- Create: `app/d-day/page.tsx`
- Modify: `next.config.ts`
- Delete: `app/schedule/page.tsx`, `app/travel/page.tsx`

This task depends on Task 1 (the `GatedPage` type must include `'d-day'`).

- [ ] **Step 1: Write failing test for D-Day page (smoke test)**

Create `__tests__/app/d-day/page.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({ get: vi.fn().mockReturnValue(undefined) }),
}))

// Mock gate
vi.mock('@/lib/gate', () => ({
  getPageAccess: vi.fn().mockReturnValue({ state: 'teaser', unlocksAt: new Date('2026-11-20') }),
}))

// Mock GatedPage — teaser state renders teaserContent
vi.mock('@/components/ui/GatedPage', () => ({
  GatedPage: ({ teaserContent, state }: { teaserContent: React.ReactNode; state: string }) =>
    state === 'teaser' ? <>{teaserContent}</> : <div>unlocked</div>,
}))

vi.mock('@/features/schedule/EventBlock', () => ({
  EventBlock: ({ event }: { event: { name: string } }) => <div>{event.name}</div>,
}))

vi.mock('@/features/travel/LogisticsCard', () => ({
  LogisticsCard: ({ label }: { label: string }) => <div>{label}</div>,
}))

vi.mock('@/features/travel/MapSection', () => ({
  MapSection: () => <div>Map</div>,
}))

vi.mock('@/components/ui/ScriptureStrip', () => ({
  ScriptureStrip: () => <div>Scripture</div>,
}))

import DayPage from '@/app/d-day/page'

describe('D-Day page', () => {
  it('renders teaser content when gate is locked', async () => {
    const page = await DayPage()
    render(page)
    expect(screen.getByText(/still being written/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL (module not found)**

```bash
npx vitest run __tests__/app/d-day/page.test.tsx
```

Expected: FAIL — `Cannot find module '@/app/d-day/page'`

- [ ] **Step 3: Create `app/d-day/page.tsx`**

The page merges both schedule and travel. Teaser shows before unlock. Partial shows location overview but no addresses or full schedule. Full shows all three events + map + venues + hotels.

```tsx
import { cookies }        from 'next/headers'
import { getPageAccess }  from '@/lib/gate'
import { GatedPage }      from '@/components/ui/GatedPage'
import { ScriptureStrip } from '@/components/ui/ScriptureStrip'
import { EventBlock }     from '@/features/schedule/EventBlock'
import { LogisticsCard }  from '@/features/travel/LogisticsCard'
import { MapSection }     from '@/features/travel/MapSection'
import { UNLOCK_DATES }   from '@/config/reveal'
import { EVENTS, VERSES, TRAVEL_INFO } from '@/config/content'

export default async function DDayPage() {
  const cookieStore = await cookies()
  const rsvpStatus  = cookieStore.get('rsvp_status')?.value
  const access      = getPageAccess('d-day', rsvpStatus)

  const teaser = (
    <div className="min-h-screen bg-plum flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-script italic text-gold/60 text-2xl">
        The path to us is still being written
      </p>
      <p className="font-sans text-ivory/25 text-xs tracking-[0.16em] uppercase">
        D-Day details unlock{' '}
        {UNLOCK_DATES['d-day'].toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
    </div>
  )

  const partial = (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        D-Day
      </h1>
      <p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        February 18, 2027 · RSVP to unlock full details
      </p>

      <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-6">
        <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
        <h2 className="font-display text-xl text-plum mb-5">Location</h2>
        <LogisticsCard label="Country" value={TRAVEL_INFO.country} />
        <LogisticsCard label="City"    value={TRAVEL_INFO.city}    />
        <LogisticsCard label="Airport" value={TRAVEL_INFO.airportName} subValue={TRAVEL_INFO.airportDistance} />
      </div>

      <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-8">
        <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
        <h2 className="font-display text-xl text-plum mb-5">Recommended Hotels</h2>
        {[...TRAVEL_INFO.hotels].map(hotel => (
          <LogisticsCard key={hotel.name} label={hotel.area} value={hotel.name} />
        ))}
      </div>

      <p className="font-sans text-xs text-center text-plum/35 tracking-[0.12em] uppercase">
        RSVP to unlock the full schedule, addresses, hotel booking codes, and the interactive venue map
      </p>
    </section>
  )

  return (
    <GatedPage state={access.state} unlocksAt={access.unlocksAt} teaserContent={teaser} partialContent={partial}>
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-32">
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          D-Day
        </h1>
        <p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          February 18, 2027 · Three celebrations
        </p>

        {/* Schedule */}
        <div className="space-y-8 mb-16">
          {[...EVENTS].map(event => (
            <EventBlock key={event.id} event={event} />
          ))}
        </div>

        <ScriptureStrip
          text={VERSES.schedule.text}
          reference={VERSES.schedule.ref}
        />

        {/* Travel */}
        <div className="mt-16">
          <h2 className="font-display text-2xl text-plum text-center mb-12">
            Getting There
          </h2>

          <div className="mb-8">
            <MapSection />
          </div>

          <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-6">
            <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
            <h3 className="font-display text-xl text-plum mb-5">Venues</h3>
            <LogisticsCard label="Ceremony"  value={TRAVEL_INFO.ceremonyAddress}  />
            <LogisticsCard label="Reception" value={TRAVEL_INFO.receptionAddress} />
          </div>

          <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60">
            <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
            <h3 className="font-display text-xl text-plum mb-5">Hotels</h3>
            {[...TRAVEL_INFO.hotels].map(hotel => (
              <LogisticsCard
                key={hotel.name}
                label={hotel.name}
                value={hotel.area}
                subValue={hotel.bookingCode.startsWith('[') ? undefined : `Booking code: ${hotel.bookingCode}`}
              />
            ))}
          </div>
        </div>
      </section>
    </GatedPage>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run __tests__/app/d-day/page.test.tsx
```

Expected: PASS

- [ ] **Step 5: Add redirects to `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/schedule', destination: '/d-day', permanent: true },
      { source: '/travel',   destination: '/d-day', permanent: true },
    ]
  },
}

export default nextConfig
```

- [ ] **Step 6: Delete old page files**

```bash
rm "app/schedule/page.tsx"
rm "app/travel/page.tsx"
```

- [ ] **Step 7: Run full test suite**

```bash
npx vitest run
```

Expected: All previously passing tests still pass. The `EventBlock.test.tsx` and `LogisticsCard.test.tsx` tests are unaffected (they test components directly, not pages). If `__tests__/features/schedule/EventBlock.test.tsx` or `__tests__/features/travel/LogisticsCard.test.tsx` fail, check that the component imports are unchanged.

- [ ] **Step 8: Commit**

```bash
git add app/d-day/page.tsx __tests__/app/d-day/page.test.tsx next.config.ts
git rm app/schedule/page.tsx app/travel/page.tsx
git commit -m "feat: combine schedule and travel into d-day page with redirects"
```

---

## Task 3: Gallery labels + Quiz 10 questions + Quiz scroll lock

**Files:**
- Modify: `features/gallery/GalleryFilterTabs.tsx`
- Modify: `__tests__/features/gallery/GalleryFilterTabs.test.tsx`
- Modify: `config/content.ts` (QUIZ_QUESTIONS only)
- Modify: `features/quiz-widget/QuizWidgetButton.tsx`

- [ ] **Step 1: Update gallery tab labels in `features/gallery/GalleryFilterTabs.tsx`**

Change the TABS array (only the label strings — values stay the same):

```ts
const TABS: { label: string; value: GalleryCategory }[] = [
  { label: 'All',              value: 'all'            },
  { label: "Couple's Journey", value: 'couple-journey' },
  { label: 'Proposal',         value: 'proposal'       },
]
```

- [ ] **Step 2: Update gallery filter tab tests**

Replace the full content of `__tests__/features/gallery/GalleryFilterTabs.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryFilterTabs } from '@/features/gallery/GalleryFilterTabs'

describe('GalleryFilterTabs', () => {
  it('renders all three tabs', () => {
    render(<GalleryFilterTabs active="all" onChange={vi.fn()} />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it("marks the active tab as selected", () => {
    render(<GalleryFilterTabs active="couple-journey" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: "Couple's Journey" })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false')
  })

  it("calls onChange with couple-journey when that tab is clicked", () => {
    const onChange = vi.fn()
    render(<GalleryFilterTabs active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: "Couple's Journey" }))
    expect(onChange).toHaveBeenCalledWith('couple-journey')
  })

  it('calls onChange with proposal when that tab is clicked', () => {
    const onChange = vi.fn()
    render(<GalleryFilterTabs active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Proposal' }))
    expect(onChange).toHaveBeenCalledWith('proposal')
  })
})
```

- [ ] **Step 3: Run gallery tab tests**

```bash
npx vitest run __tests__/features/gallery/GalleryFilterTabs.test.tsx
```

Expected: 4 tests pass

- [ ] **Step 4: Add 5 new quiz questions to `config/content.ts`**

Replace the entire `QUIZ_QUESTIONS` constant (keep existing 5, append 5 new). The new questions come from the couple's story in `STORY_MILESTONES`:

```ts
export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Where did Feyisogo and Dimeji first meet?',
    options: ['A library', 'Covenant University chapel', "A mutual friend's party", 'Online'],
    answer: 1,
  },
  {
    id: 'q2',
    question: 'How long did their first Instagram conversation last?',
    options: ['1 hour', '2 hours', '5 hours', 'All night'],
    answer: 2,
  },
  {
    id: 'q3',
    question: 'Where did Dimeji propose?',
    options: ['Paris, France', 'Lagos, Nigeria', 'Mallorca, Spain', 'Washington D.C.'],
    answer: 2,
  },
  {
    id: 'q4',
    question: 'In what year did Feyisogo move to Germany?',
    options: ['2024', '2025', '2026', '2027'],
    answer: 2,
  },
  {
    id: 'q5',
    question: 'When did they officially become a couple?',
    options: ['April 2018', 'December 2023', 'January 2, 2025', 'March 2026'],
    answer: 2,
  },
  {
    id: 'q6',
    question: 'Which country did Feyisogo travel to for the first time to visit Dimeji?',
    options: ['United Kingdom', 'United States', 'Germany', 'Canada'],
    answer: 2,
  },
  {
    id: 'q7',
    question: 'Where were Dimeji and Feyisogo when the conversation about their future turned serious?',
    options: ['A rooftop restaurant in Lagos', 'Museum of the Bible, Washington D.C.', 'A beach in Mallorca', 'The Covenant University chapel'],
    answer: 1,
  },
  {
    id: 'q8',
    question: 'In which month did Dimeji quietly begin building a wedding playlist?',
    options: ['January 2024', 'April 2024', 'December 2024', 'March 2025'],
    answer: 1,
  },
  {
    id: 'q9',
    question: 'Where did both families first spend meaningful time together?',
    options: ['Mallorca, Spain', 'Washington D.C., USA', 'Lagos, Nigeria', 'Frankfurt, Germany'],
    answer: 2,
  },
  {
    id: 'q10',
    question: 'What was the setting Dimeji chose for the proposal in Mallorca?',
    options: ['A rooftop at sunset', 'A beach at midnight', 'A quiet picnic overlooking a vineyard', 'A private boat'],
    answer: 2,
  },
] as const
```

- [ ] **Step 5: Update quiz widget — body scroll lock and 70dvh**

In `features/quiz-widget/QuizWidgetButton.tsx`, make two changes:

1. Add body scroll lock effect (separate `useEffect` that reacts to `open`):

```tsx
'use client'
import { useState, useEffect }    from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QuizModule }              from '@/features/guestbook/quiz/QuizModule'

export function QuizWidgetButton() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open quiz"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-plum flex items-center justify-center hover:bg-plum/90 transition-colors duration-200"
        style={{ boxShadow: '0 4px 16px rgba(91,61,110,0.4)' }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
          <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
          <path d="M6 4h12v8a6 6 0 0 1-12 0V4z"/>
          <line x1="9"  y1="21" x2="15" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="quiz-backdrop"
              aria-label="Close quiz backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="quiz-drawer"
              role="dialog"
              aria-modal={true}
              aria-label="How Well Do You Know Us?"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-ivory rounded-t-2xl overflow-y-auto"
              style={{ maxHeight: '70dvh' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gold/15">
                <h2 className="font-display text-xl text-plum">How Well Do You Know Us?</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close quiz"
                  className="text-plum/40 hover:text-plum transition-colors duration-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-8">
                <QuizModule />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 6: Run quiz widget and quiz module tests**

```bash
npx vitest run __tests__/features/quiz-widget/QuizWidgetButton.test.tsx __tests__/features/guestbook/quiz/QuizModule.test.tsx __tests__/app/api/quiz/route.test.ts
```

Expected: all pass (existing QuizWidgetButton tests do not check body.style.overflow so they are unaffected)

- [ ] **Step 7: Commit**

```bash
git add features/gallery/GalleryFilterTabs.tsx __tests__/features/gallery/GalleryFilterTabs.test.tsx config/content.ts features/quiz-widget/QuizWidgetButton.tsx
git commit -m "feat: update gallery labels, expand quiz to 10 questions, add quiz scroll lock"
```

---

## Task 4: Responsive sweep

**Files:** 9 component/page files — purely Tailwind class changes, no logic changes.

Every change follows one of two rules:
- `py-32` → `py-16 md:py-32` (vertical breathing room on mobile)
- `text-[Npx]` below `text-xs` (12px) → `text-xs` (readability on small screens)
- `px-12` → `px-4 sm:px-12` (horizontal padding for small viewports)
- SVG with fixed `width={N}` → wrap in responsive container, SVG takes `w-full h-auto`

- [ ] **Step 1: Fix `features/gallery/LightboxModal.tsx`**

Two changes:
1. Inner container `px-12` → `px-4 sm:px-12`
2. Close button `right-14` → `right-2 sm:right-14`

```tsx
// Before:
<div
  className="relative w-full max-w-4xl max-h-[90vh] px-12"
  onClick={e => e.stopPropagation()}
>
  ...
  <button
    onClick={onClose}
    aria-label="Close lightbox"
    className="absolute top-0 right-14 text-ivory/60 hover:text-ivory text-3xl leading-none"
  >

// After:
<div
  className="relative w-full max-w-4xl max-h-[90vh] px-4 sm:px-12"
  onClick={e => e.stopPropagation()}
>
  ...
  <button
    onClick={onClose}
    aria-label="Close lightbox"
    className="absolute top-0 right-2 sm:right-14 text-ivory/60 hover:text-ivory text-3xl leading-none"
  >
```

- [ ] **Step 2: Fix `features/registry/RegistrySection.tsx`**

Both card `<button>` wrappers use `w-64`. Change to `w-full max-w-[256px]` so cards stack gracefully on narrow viewports:

```tsx
// Before (Card 1):
<button
  ...
  className="w-64 h-80 cursor-pointer select-none text-left"

// After (Card 1):
<button
  ...
  className="w-full max-w-[256px] h-80 cursor-pointer select-none text-left"
```

Apply the same change to Card 2 (the Gift List button).

- [ ] **Step 3: Fix `features/hero/AstrolabeCountdown.tsx`**

The SVG has a fixed `width={SIZE}` (`SIZE = 220`). Wrap it in a responsive container instead of letting it overflow on small screens. Change:

```tsx
// Before:
<svg
  width={SIZE}
  height={SIZE}
  viewBox={`0 0 ${SIZE} ${SIZE}`}
  ...
>

// After (add max-w and w-full to containing div, remove fixed width/height from svg):
<div className="flex flex-col items-center gap-4">
  <div className="w-full max-w-[220px]">
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      ...
    >
```

The outer `<div className="flex flex-col items-center gap-4">` is already there — just add the inner wrapper div around the SVG.

- [ ] **Step 4: Fix `features/timeline/TimelineSection.tsx`**

```tsx
// Before:
<section className="relative max-w-3xl mx-auto px-6 py-32">
...
<div className="relative pl-8">

// After:
<section className="relative max-w-3xl mx-auto px-6 py-16 md:py-32">
...
<div className="relative pl-6 md:pl-8">
```

Also update subtitle from `text-[11px]` → `text-xs`:

```tsx
// Before:
<p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-20">

// After:
<p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30 text-center mb-20">
```

- [ ] **Step 5: Fix `features/timeline/MilestoneCard.tsx`**

Three text size fixes — chapter label, date label, and photo placeholder span:

```tsx
// Before:
<p className="font-sans text-[10px] tracking-[0.22em] uppercase text-gold/45 mb-1">
...
<p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/30 mb-5">
...
<span className="font-sans text-[9px] tracking-[0.18em] uppercase text-gold/15">

// After:
<p className="font-sans text-xs tracking-[0.22em] uppercase text-gold/45 mb-1">
...
<p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30 mb-5">
...
<span className="font-sans text-xs tracking-[0.18em] uppercase text-gold/15">
```

- [ ] **Step 6: Fix `app/gallery/page.tsx`**

```tsx
// Before:
<section className="max-w-5xl mx-auto px-6 py-32">
...
<p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">

// After:
<section className="max-w-5xl mx-auto px-6 py-16 md:py-32">
...
<p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
```

- [ ] **Step 7: Fix `app/rsvp/page.tsx`**

```tsx
// Before:
<p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30">

// After:
<p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30">
```

- [ ] **Step 8: Fix `app/registry/page.tsx`**

```tsx
// Before:
<section className="max-w-2xl mx-auto px-6 py-32">
...
<p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">

// After:
<section className="max-w-2xl mx-auto px-6 py-16 md:py-32">
...
<p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
```

- [ ] **Step 9: Fix `app/guestbook/page.tsx`**

```tsx
// Before:
<div className="max-w-4xl mx-auto px-6 py-32">
...
<p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">

// After:
<div className="max-w-4xl mx-auto px-6 py-16 md:py-32">
...
<p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
```

- [ ] **Step 10: Fix `components/layout/Footer.tsx`**

```tsx
// Before:
<p className="font-sans font-medium text-[10px] tracking-[0.18em] uppercase text-gold/40">
...
<p className="font-sans text-[11px] tracking-[0.16em] uppercase text-ivory/30">

// After:
<p className="font-sans font-medium text-xs tracking-[0.18em] uppercase text-gold/40">
...
<p className="font-sans text-xs tracking-[0.16em] uppercase text-ivory/30">
```

- [ ] **Step 11: Fix `features/registry/RegistrySection.tsx` — DetailRow and tab button text sizes**

While we're in RegistrySection for the card width fix (Step 2), also raise the sub-`xs` sizes in DetailRow and tab buttons. `DetailRow` label is `text-[9px]` and tab buttons are `text-[9px]`:

```tsx
// Before (DetailRow):
<p className="font-sans text-[9px] uppercase tracking-[0.12em] text-plum/50 mt-2">{label}</p>
<p className="font-sans text-[12px] font-semibold text-plum">{value}</p>

// After (DetailRow):
<p className="font-sans text-xs uppercase tracking-[0.12em] text-plum/50 mt-2">{label}</p>
<p className="font-sans text-xs font-semibold text-plum">{value}</p>
```

Tab buttons in the switcher are `text-[9px]`:
```tsx
// Before:
className={`flex-1 py-1.5 font-sans text-[9px] font-bold tracking-widest uppercase ...`}

// After:
className={`flex-1 py-1.5 font-sans text-xs font-bold tracking-widest uppercase ...`}
```

(Both `account === 'ng'` and `account === 'intl'` buttons — apply to both.)

Other small text in RegistrySection back faces:
```tsx
// Before (card labels):
<p className="font-sans text-[9px] font-bold tracking-[0.14em] uppercase text-plum mb-3">
...
<p className="font-sans text-[9px] uppercase tracking-[0.12em] text-plum/50 mb-4">

// After:
<p className="font-sans text-xs font-bold tracking-[0.14em] uppercase text-plum mb-3">
...
<p className="font-sans text-xs uppercase tracking-[0.12em] text-plum/50 mb-4">
```

And card front subtitles (`text-[10px]`, `text-[11px]`):
```tsx
// Before (Card 1 front):
<p className="font-sans text-[11px] tracking-[0.16em] uppercase text-white font-bold mb-2">
<p className="font-sans text-[10px] text-white/70 tracking-widest">

// After:
<p className="font-sans text-xs tracking-[0.16em] uppercase text-white font-bold mb-2">
<p className="font-sans text-xs text-white/70 tracking-widest">
```

Apply the same `text-[11px]` → `text-xs` and `text-[10px]` → `text-xs` to Card 2 front face as well.

- [ ] **Step 12: Run full test suite to confirm no regressions**

```bash
npx vitest run
```

Expected: all tests pass. The responsive changes are purely class additions — no logic changed, so tests are unaffected.

- [ ] **Step 13: Commit**

```bash
git add features/gallery/LightboxModal.tsx features/registry/RegistrySection.tsx features/hero/AstrolabeCountdown.tsx features/timeline/TimelineSection.tsx features/timeline/MilestoneCard.tsx app/gallery/page.tsx app/rsvp/page.tsx app/registry/page.tsx app/guestbook/page.tsx components/layout/Footer.tsx
git commit -m "fix: responsive sweep — mobile padding, minimum text sizes, fluid countdown"
```
