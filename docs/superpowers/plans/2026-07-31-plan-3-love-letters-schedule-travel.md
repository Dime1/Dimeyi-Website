# Love Letters · Schedule · Travel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Love Letters scrapbook page, the full Schedule event-block UI (inside the existing gate wrapper), and the upgraded Travel page with logistics info in both partial and full gate states.

**Architecture:** Three feature folders: `features/love-letters/`, `features/schedule/`, `features/travel/`. All copy lives in `config/content.ts` (new constants added in Task 1). The existing `GatedPage` wrapper on schedule/travel pages is kept; this plan replaces the placeholder children with real UI components. No new server routes needed.

**Tech Stack:** Next.js App Router, Framer Motion (AnimatePresence), Tailwind CSS v4, `next/image`, Vitest + React Testing Library

---

## File Map

| File | Responsibility |
|------|---------------|
| `config/content.ts` | Add `LOVE_LETTERS` and `TRAVEL_INFO` constants |
| `features/love-letters/LetterCard.tsx` | Single expandable letter card with Framer Motion open/close |
| `features/love-letters/ScrapbookModule.tsx` | Grid of letter cards + section heading |
| `features/schedule/EventBlock.tsx` | One event: name, date/time, location, dress code, cultural note |
| `features/schedule/AddToCalendarButton.tsx` | Google Calendar link + ICS download; disabled when time is placeholder |
| `features/travel/LogisticsCard.tsx` | One hotel/location info item (partial or full detail level) |
| `app/love-letters/page.tsx` | Wire ScrapbookModule |
| `app/schedule/page.tsx` | Full content: 3 EventBlocks + ScriptureStrip (inside existing GatedPage) |
| `app/travel/page.tsx` | Partial state: LogisticsCards; Full state: LogisticsCards + map placeholder |
| `__tests__/features/love-letters/ScrapbookModule.test.tsx` | 3 tests |
| `__tests__/features/schedule/EventBlock.test.tsx` | 4 tests |
| `__tests__/features/travel/LogisticsCard.test.tsx` | 3 tests |

---

### Task 1: Content additions

**Files:**
- Modify: `config/content.ts`

No tests (data-only change).

- [ ] **Step 1: Read current config/content.ts**

Read the file first to see the existing exports and find the end of the file.

- [ ] **Step 2: Add LOVE_LETTERS and TRAVEL_INFO**

At the end of `config/content.ts`, append these two exports:

```ts
export const LOVE_LETTERS = [
  {
    id:      'letter-dimeji',
    from:    'Dimeji',
    to:      'Feyisogo',
    date:    '[LETTER_DATE_1]',
    preview: '[LETTER_1_OPENING_LINE]',
    body:    '[LETTER_1_FULL_TEXT]',
  },
  {
    id:      'letter-feyisogo',
    from:    'Feyisogo',
    to:      'Dimeji',
    date:    '[LETTER_DATE_2]',
    preview: '[LETTER_2_OPENING_LINE]',
    body:    '[LETTER_2_FULL_TEXT]',
  },
] as const

export const TRAVEL_INFO = {
  country:         'Nigeria',
  city:            '[CITY]',
  region:          '[STATE]',
  airportName:     '[AIRPORT_NAME]',
  airportDistance: '[X km] from venue',
  hotels: [
    {
      name:        '[HOTEL_1_NAME]',
      area:        '[HOTEL_1_AREA]',
      bookingCode: '[HOTEL_1_BOOKING_CODE]',
      url:         '[HOTEL_1_URL]',
    },
    {
      name:        '[HOTEL_2_NAME]',
      area:        '[HOTEL_2_AREA]',
      bookingCode: '[HOTEL_2_BOOKING_CODE]',
      url:         '[HOTEL_2_URL]',
    },
  ],
  ceremonyAddress:  '[CEREMONY_FULL_ADDRESS]',
  receptionAddress: '[RECEPTION_FULL_ADDRESS]',
} as const
```

- [ ] **Step 3: Verify build still passes**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add config/content.ts && git commit -m "feat: add LOVE_LETTERS and TRAVEL_INFO placeholder content to config"
```

---

### Task 2: LetterCard + ScrapbookModule (TDD)

**Files:**
- Create: `__tests__/features/love-letters/ScrapbookModule.test.tsx`
- Create: `features/love-letters/LetterCard.tsx`
- Create: `features/love-letters/ScrapbookModule.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/features/love-letters/ScrapbookModule.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrapbookModule } from '@/features/love-letters/ScrapbookModule'
import { LOVE_LETTERS } from '@/config/content'

describe('ScrapbookModule', () => {
  it('renders the Love Letters heading', () => {
    render(<ScrapbookModule />)
    expect(screen.getByRole('heading', { name: /love letters/i })).toBeInTheDocument()
  })

  it('renders a card for each letter', () => {
    render(<ScrapbookModule />)
    for (const letter of LOVE_LETTERS) {
      expect(screen.getByText(`From ${letter.from}`)).toBeInTheDocument()
    }
  })

  it('renders "To" recipient line for each letter', () => {
    render(<ScrapbookModule />)
    for (const letter of LOVE_LETTERS) {
      expect(screen.getByText(`To ${letter.to}, with love`)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run test:run 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module '@/features/love-letters/ScrapbookModule'`

- [ ] **Step 3: Create LetterCard**

Create `features/love-letters/LetterCard.tsx`:
```tsx
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
```

- [ ] **Step 4: Create ScrapbookModule**

Create `features/love-letters/ScrapbookModule.tsx`:
```tsx
import { LOVE_LETTERS } from '@/config/content'
import { LetterCard }   from '@/features/love-letters/LetterCard'

const ROTATIONS = [-1.5, 0.8, -0.5, 1.2]

export function ScrapbookModule() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Love Letters
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        Words that carried us here
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...LOVE_LETTERS].map((letter, i) => (
          <LetterCard
            key={letter.id}
            letter={letter}
            rotation={ROTATIONS[i % ROTATIONS.length]}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run tests — confirm 23 pass**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run test:run 2>&1 | tail -10
```

Expected: 23 PASS (20 existing + 3 new), 0 FAIL

- [ ] **Step 6: Wire love-letters page**

Replace `app/love-letters/page.tsx`:
```tsx
import { ScrapbookModule } from '@/features/love-letters/ScrapbookModule'

export default function LoveLettersPage() {
  return <ScrapbookModule />
}
```

- [ ] **Step 7: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/love-letters/ __tests__/features/love-letters/ app/love-letters/page.tsx && git commit -m "feat: add Love Letters scrapbook with expandable letter cards (TDD, 3 tests)"
```

---

### Task 3: EventBlock + AddToCalendarButton (TDD)

**Files:**
- Create: `__tests__/features/schedule/EventBlock.test.tsx`
- Create: `features/schedule/EventBlock.tsx`
- Create: `features/schedule/AddToCalendarButton.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/features/schedule/EventBlock.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventBlock } from '@/features/schedule/EventBlock'
import { EVENTS } from '@/config/content'

describe('EventBlock', () => {
  // Use the Church Ceremony event (index 1) — has the most stable fixed content
  const event = EVENTS[1]

  it('renders the event name', () => {
    render(<EventBlock event={event} />)
    expect(screen.getByText('Church Ceremony')).toBeInTheDocument()
  })

  it('renders the event date', () => {
    render(<EventBlock event={event} />)
    expect(screen.getByText(/February 18, 2027/)).toBeInTheDocument()
  })

  it('renders a disabled calendar button when time is a placeholder', () => {
    render(<EventBlock event={event} />)
    const btn = screen.getByRole('button', { name: /add to calendar/i })
    expect(btn).toBeDisabled()
  })

  it('renders the cultural note when present', () => {
    const reception = EVENTS[2]  // Reception has a note about aso-ebi
    render(<EventBlock event={reception} />)
    expect(screen.getByText(/aso-ebi/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run test:run 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module '@/features/schedule/EventBlock'`

- [ ] **Step 3: Create AddToCalendarButton**

Create `features/schedule/AddToCalendarButton.tsx`:
```tsx
'use client'

import type { EVENTS } from '@/config/content'

type Event = (typeof EVENTS)[number]

interface AddToCalendarButtonProps {
  event: Event
}

function isPlaceholder(val: string) {
  return val.startsWith('[')
}

function buildGoogleCalendarUrl(event: Event): string {
  // Best-effort: use the 18 Feb 2027 date; time is unknown until placeholder is replaced
  const base = 'https://www.google.com/calendar/render'
  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     event.name,
    dates:    '20270218T120000Z/20270218T140000Z',
    location: isPlaceholder(event.location) ? '' : event.location,
    details:  event.note ?? '',
  })
  return `${base}?${params.toString()}`
}

export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  const disabled = isPlaceholder(event.time)

  if (disabled) {
    return (
      <button
        disabled
        className="font-sans text-[10px] tracking-[0.16em] uppercase text-plum/25 border border-plum/10 rounded-sm px-4 py-2 cursor-not-allowed"
        aria-label="Add to calendar — details coming soon"
      >
        Add to Calendar
      </button>
    )
  }

  const googleUrl = buildGoogleCalendarUrl(event)

  return (
    <a
      href={googleUrl}
      target="_blank"
      rel="noopener noreferrer"
      role="button"
      className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.16em] uppercase text-gold border border-gold/30 rounded-sm px-4 py-2 hover:border-gold hover:bg-gold/5 transition-colors duration-150"
      aria-label={`Add ${event.name} to Google Calendar`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
        <path d="M5 0a5 5 0 1 0 0 10A5 5 0 0 0 5 0Zm.5 7.5h-1v-3h1v3Zm0-4h-1v-1h1v1Z"/>
      </svg>
      Add to Calendar
    </a>
  )
}
```

- [ ] **Step 4: Create EventBlock**

Create `features/schedule/EventBlock.tsx`:
```tsx
import type { EVENTS }              from '@/config/content'
import { AddToCalendarButton }      from '@/features/schedule/AddToCalendarButton'

type Event = (typeof EVENTS)[number]

interface EventBlockProps {
  event: Event
}

function isPlaceholder(val: string) {
  return val.startsWith('[')
}

export function EventBlock({ event }: EventBlockProps) {
  return (
    <article className="border border-gold/15 rounded-sm px-8 py-10 bg-ivory/60 backdrop-blur-sm">
      {/* Gold top rule */}
      <div className="w-10 h-px bg-gold/40 mb-6" aria-hidden="true" />

      {/* Event name */}
      <h2 className="font-display text-2xl md:text-3xl text-plum mb-3">{event.name}</h2>

      {/* Date + time */}
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/45 mb-1">
        {event.date}
        {!isPlaceholder(event.time) && ` · ${event.time}`}
      </p>

      {/* Location */}
      {!isPlaceholder(event.location) && (
        <p className="font-sans text-sm text-plum/65 mb-5">{event.location}</p>
      )}

      {/* Dress code */}
      {!isPlaceholder(event.dresscode) && (
        <div className="mb-5">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold/45 mb-1">
            Dress code
          </p>
          <p className="font-sans text-sm text-plum/65">{event.dresscode}</p>
        </div>
      )}

      {/* Cultural note */}
      {event.note && (
        <p className="font-sans text-xs text-plum/40 leading-relaxed italic border-l border-gold/20 pl-4 mb-6">
          {event.note}
        </p>
      )}

      <AddToCalendarButton event={event} />
    </article>
  )
}
```

- [ ] **Step 5: Run tests — confirm 27 pass**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run test:run 2>&1 | tail -10
```

Expected: 27 PASS (23 existing + 4 new), 0 FAIL

- [ ] **Step 6: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/schedule/ __tests__/features/schedule/ && git commit -m "feat: add EventBlock and AddToCalendarButton (TDD, 4 tests)"
```

---

### Task 4: Wire Schedule page with full content

**Files:**
- Modify: `app/schedule/page.tsx`

No new tests (EventBlock already tested; integration is visual).

- [ ] **Step 1: Read current app/schedule/page.tsx**

Read the file to understand the existing GatedPage wrapper structure.

- [ ] **Step 2: Replace full content section**

Replace `app/schedule/page.tsx` with:
```tsx
import { getPageAccess }   from '@/lib/gate'
import { GatedPage }       from '@/components/ui/GatedPage'
import { ScriptureStrip }  from '@/components/ui/ScriptureStrip'
import { EventBlock }      from '@/features/schedule/EventBlock'
import { UNLOCK_DATES }    from '@/config/reveal'
import { EVENTS, VERSES }  from '@/config/content'

export default function SchedulePage() {
  const access = getPageAccess('schedule')

  const teaser = (
    <div className="min-h-screen bg-plum flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-script italic text-gold/60 text-2xl">
        The path to us is still being written
      </p>
      <p className="font-sans text-ivory/25 text-xs tracking-[0.16em] uppercase">
        Schedule details unlock{' '}
        {UNLOCK_DATES.schedule.toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
    </div>
  )

  return (
    <GatedPage state={access.state} unlocksAt={access.unlocksAt} teaserContent={teaser}>
      <section className="max-w-3xl mx-auto px-6 py-32">
        {/* Section heading */}
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          Schedule
        </h1>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          February 18, 2027 · Three celebrations
        </p>

        {/* Event blocks */}
        <div className="space-y-8">
          {[...EVENTS].map(event => (
            <EventBlock key={event.id} event={event} />
          ))}
        </div>

        {/* Scripture strip */}
        <ScriptureStrip
          text={VERSES.schedule.text}
          reference={VERSES.schedule.ref}
        />
      </section>
    </GatedPage>
  )
}
```

- [ ] **Step 3: Build check**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run build 2>&1 | tail -15
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add app/schedule/page.tsx && git commit -m "feat: wire Schedule page with full EventBlock content and scripture strip"
```

---

### Task 5: LogisticsCard (TDD)

**Files:**
- Create: `__tests__/features/travel/LogisticsCard.test.tsx`
- Create: `features/travel/LogisticsCard.tsx`

- [ ] **Step 1: Write failing tests**

Create `__tests__/features/travel/LogisticsCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogisticsCard } from '@/features/travel/LogisticsCard'

describe('LogisticsCard', () => {
  it('renders the card label', () => {
    render(<LogisticsCard label="Airport" value="[AIRPORT_NAME]" />)
    expect(screen.getByText('Airport')).toBeInTheDocument()
  })

  it('renders a placeholder indicator when value starts with [', () => {
    render(<LogisticsCard label="Hotel" value="[HOTEL_NAME]" />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })

  it('renders the actual value when not a placeholder', () => {
    render(<LogisticsCard label="Country" value="Nigeria" />)
    expect(screen.getByText('Nigeria')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run test:run 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module '@/features/travel/LogisticsCard'`

- [ ] **Step 3: Create LogisticsCard**

Create `features/travel/LogisticsCard.tsx`:
```tsx
interface LogisticsCardProps {
  label:    string
  value:    string
  subValue?: string
  icon?:    React.ReactNode
}

export function LogisticsCard({ label, value, subValue, icon }: LogisticsCardProps) {
  const isPending = value.startsWith('[')

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gold/10 last:border-0">
      {icon && (
        <div className="flex-shrink-0 mt-0.5 text-gold/40" aria-hidden="true">
          {icon}
        </div>
      )}
      <div>
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-plum/35 mb-1">
          {label}
        </p>
        {isPending ? (
          <p className="font-sans text-sm text-plum/25 italic">Coming soon</p>
        ) : (
          <>
            <p className="font-sans text-sm text-plum/75">{value}</p>
            {subValue && (
              <p className="font-sans text-xs text-plum/40 mt-0.5">{subValue}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — confirm 30 pass**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run test:run 2>&1 | tail -10
```

Expected: 30 PASS (27 existing + 3 new), 0 FAIL

- [ ] **Step 5: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/travel/LogisticsCard.tsx __tests__/features/travel/LogisticsCard.test.tsx && git commit -m "feat: add LogisticsCard component for travel info display (TDD, 3 tests)"
```

---

### Task 6: Wire Travel page with real partial + full content

**Files:**
- Create: `features/travel/MapSection.tsx`
- Modify: `app/travel/page.tsx`

No new tests (LogisticsCard tested; map is a presentational placeholder).

- [ ] **Step 1: Create MapSection**

Create `features/travel/MapSection.tsx`:
```tsx
export function MapSection() {
  const hasToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)

  if (hasToken) {
    // Mapbox embed will be wired here once the token is in .env.local
    // For now, this branch renders the placeholder below (token not yet configured)
    return <MapPlaceholder />
  }

  return <MapPlaceholder />
}

function MapPlaceholder() {
  return (
    <div className="relative w-full aspect-[16/9] max-h-80 rounded-sm overflow-hidden border border-gold/10 bg-plum/5 flex flex-col items-center justify-center gap-3">
      {/* Decorative compass */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="#C9A24B" strokeWidth="0.6" opacity="0.3"/>
        <line x1="16" y1="4" x2="16" y2="28" stroke="#C9A24B" strokeWidth="0.5" opacity="0.2"/>
        <line x1="4" y1="16" x2="28" y2="16" stroke="#C9A24B" strokeWidth="0.5" opacity="0.2"/>
        <circle cx="16" cy="16" r="2" fill="#C9A24B" opacity="0.5"/>
        <path d="M16 8l1.5 6h-3L16 8Z" fill="#C9A24B" opacity="0.5"/>
      </svg>
      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/30">
        Interactive map coming soon
      </p>
      <p className="font-sans text-[9px] text-plum/20">
        Venue pins will appear here once details are confirmed
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Read current app/travel/page.tsx**

Read the file before editing it.

- [ ] **Step 3: Replace app/travel/page.tsx with real partial + full content**

Replace `app/travel/page.tsx`:
```tsx
import { getPageAccess }   from '@/lib/gate'
import { GatedPage }       from '@/components/ui/GatedPage'
import { LogisticsCard }   from '@/features/travel/LogisticsCard'
import { MapSection }      from '@/features/travel/MapSection'
import { UNLOCK_DATES }    from '@/config/reveal'
import { TRAVEL_INFO }     from '@/config/content'

export default function TravelPage() {
  // Plan 4 will replace undefined with a real RSVP status read from a cookie/session
  const rsvpStatus = undefined
  const access     = getPageAccess('travel', rsvpStatus)

  const teaser = (
    <div className="min-h-screen bg-plum flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-script italic text-gold/60 text-2xl">
        The path to us is still being written
      </p>
      <p className="font-sans text-ivory/25 text-xs tracking-[0.16em] uppercase">
        Travel details unlock{' '}
        {UNLOCK_DATES.travel.toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
    </div>
  )

  const partial = (
    <section className="max-w-3xl mx-auto px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Travel
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        General logistics — RSVP to unlock full details
      </p>

      {/* Region info */}
      <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-6">
        <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
        <h2 className="font-display text-xl text-plum mb-5">Location</h2>
        <LogisticsCard label="Country"  value={TRAVEL_INFO.country} />
        <LogisticsCard label="City"     value={TRAVEL_INFO.city} />
        <LogisticsCard label="Airport"  value={TRAVEL_INFO.airportName} subValue={TRAVEL_INFO.airportDistance} />
      </div>

      {/* Hotels (names only in partial state) */}
      <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-8">
        <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
        <h2 className="font-display text-xl text-plum mb-5">Recommended Hotels</h2>
        {[...TRAVEL_INFO.hotels].map(hotel => (
          <LogisticsCard key={hotel.name} label={hotel.area} value={hotel.name} />
        ))}
      </div>

      {/* RSVP CTA */}
      <p className="font-sans text-xs text-center text-plum/35 tracking-[0.12em] uppercase">
        RSVP to unlock addresses, hotel booking codes, and the interactive venue map
      </p>
    </section>
  )

  return (
    <GatedPage
      state={access.state}
      unlocksAt={access.unlocksAt}
      teaserContent={teaser}
      partialContent={partial}
    >
      {/* Full state — visible only after Gate 1 (date) + Gate 2 (RSVP attending) */}
      <section className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          Travel
        </h1>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          Everything you need to find us
        </p>

        {/* Map */}
        <div className="mb-8">
          <MapSection />
        </div>

        {/* Venue addresses */}
        <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-6">
          <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
          <h2 className="font-display text-xl text-plum mb-5">Venues</h2>
          <LogisticsCard label="Ceremony"  value={TRAVEL_INFO.ceremonyAddress} />
          <LogisticsCard label="Reception" value={TRAVEL_INFO.receptionAddress} />
        </div>

        {/* Hotels with booking codes */}
        <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60">
          <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
          <h2 className="font-display text-xl text-plum mb-5">Hotels</h2>
          {[...TRAVEL_INFO.hotels].map(hotel => (
            <LogisticsCard
              key={hotel.name}
              label={hotel.name}
              value={hotel.area}
              subValue={hotel.bookingCode.startsWith('[') ? undefined : `Booking code: ${hotel.bookingCode}`}
            />
          ))}
        </div>
      </section>
    </GatedPage>
  )
}
```

- [ ] **Step 4: Build check**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run build 2>&1 | tail -15
```

Expected: clean build.

- [ ] **Step 5: Run full test suite**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run test:run 2>&1 | tail -10
```

Expected: 30 PASS, 0 FAIL

- [ ] **Step 6: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/travel/MapSection.tsx app/travel/page.tsx && git commit -m "feat: wire Travel page with real logistics cards in partial and full gate states"
```

---

### Task 7: Build verification and visual check

**Files:** None

- [ ] **Step 1: Run full test suite**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run test:run -- --reporter=verbose
```

Expected: **30 PASS, 0 FAIL** across 8 test files

Test breakdown:
- `gate.test.ts`: 6
- `GatedPage.test.tsx`: 4
- `AstrolabeCountdown.test.tsx`: 3
- `MilestoneCard.test.tsx`: 4
- `TimelineSection.test.tsx`: 3
- `ScrapbookModule.test.tsx`: 3
- `EventBlock.test.tsx`: 4
- `LogisticsCard.test.tsx`: 3

- [ ] **Step 2: Production build**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm run build 2>&1 | tail -20
```

Expected: All 13 routes build cleanly.

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```

Verify the following in the browser:

- [ ] `/love-letters` — "Love Letters" heading visible; 2 letter cards in a grid; cards have slight rotation; clicking "Read letter ↓" expands the body section
- [ ] `/love-letters` — placeholder cards show "A letter is being written…" in preview
- [ ] `/schedule` — page shows teaser (the gate date is Nov 2026, still in future) with gold italic text
- [ ] `/travel` — page shows teaser (same gate date)

To preview gated content during development, temporarily force the gate state. Open `app/schedule/page.tsx` and temporarily change `getPageAccess('schedule')` to hardcode `{ state: 'full' as const }`, verify the 3 EventBlocks render, then revert.

Similarly for travel partial state: hardcode `{ state: 'partial' as const }` to verify logistics cards render.

- [ ] **Step 4: Revert any temporary dev overrides**

If you modified gate state for testing, revert now:
```bash
cd "/Users/dimeji/docs/Wedding Website" && git diff app/ && git checkout app/schedule/page.tsx app/travel/page.tsx
```

(Only run the checkout if you actually changed those files for testing.)

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered in task |
|-----------------|----------------|
| Love Letters: digital scrapbook, card unfold animation | Task 2 |
| Love Letters: cards on parchment/ivory background | Task 2 |
| Schedule: 3 event blocks (Traditional, Ceremony, Reception) | Task 3–4 |
| Schedule: time, dress code, cultural note per event | Task 3 |
| Schedule: Add-to-Calendar (Google Calendar link) | Task 3 |
| Schedule: verse strip — Ruth 1:16 | Task 4 |
| Schedule: Gate 1 teaser unchanged | Task 4 (teaser preserved) |
| Travel: partial state — city, hotel names, airport | Task 6 |
| Travel: full state — addresses, hotel booking codes | Task 6 |
| Travel: map section (placeholder until token configured) | Task 6 |
| Travel: "RSVP to unlock" CTA in partial state | Task 6 |
| Gate 1 + Gate 2 wiring unchanged on travel page | Task 6 |
| All content from config (no hardcoded copy) | Tasks 1, 3, 4, 6 |
| Placeholder graceful handling (`[...]` pattern) | Tasks 2, 3, 5, 6 |

**Not in scope for Plan 3:**
- Love Letters guest submission form (needs Supabase — Plan 4+)
- Actual Mapbox embed (needs `NEXT_PUBLIC_MAPBOX_TOKEN` and real coordinates — added when venue is confirmed)
- ICS file download (Google Calendar link sufficient for now; ICS can be added when real dates/times are filled in)
- RSVP status from session cookie (Gate 2 remains `rsvpStatus = undefined` until Plan 4)

**Type consistency:**
- `EVENTS` typed `as const` — `(typeof EVENTS)[number]` used in EventBlock and AddToCalendarButton
- `LOVE_LETTERS` typed `as const` — `(typeof LOVE_LETTERS)[number]` used in LetterCard
- `TRAVEL_INFO.hotels` typed `as const` — spread `[...TRAVEL_INFO.hotels].map()` used in TravelPage to handle readonly tuple
