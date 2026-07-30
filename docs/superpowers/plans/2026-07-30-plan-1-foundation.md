# Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Next.js project with all shared infrastructure — design tokens, content config, gate logic, Supabase client, shared UI components, Lenis smooth scroll, and page stubs — so that all feature plans (Plans 2–5) can build their pages independently without re-doing infrastructure.

**Architecture:** Next.js 15 App Router with TypeScript and Tailwind CSS v3. All content lives in `config/content.ts`; all gate logic runs server-side only in `lib/gate.ts`. Shared UI components (GatedPage, AdireBackground, AudioToggle, Nav, Footer) are built and tested here. Page shells for all 9 routes are created as stubs with placeholder content.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v3, Framer Motion v11, `@studio-freight/lenis` v1, `@supabase/supabase-js` v2, React Hook Form v7, Zod v3, Vitest + React Testing Library

---

## File Map

| File | Responsibility |
|------|---------------|
| `config/tokens.css` | CSS custom properties: palette, spacing, motion durations |
| `config/content.ts` | All copy: names, dates, milestones, verses, nav links, events, quiz questions |
| `config/reveal.ts` | Gate unlock dates in UTC + `GatedPage` type |
| `lib/gate.ts` | `getPageAccess()` — server-side gate logic, never imported on client |
| `lib/supabase.ts` | Supabase client singleton |
| `lib/hooks/useReducedMotion.ts` | Reads `prefers-reduced-motion` media query |
| `lib/hooks/useAudio.ts` | Audio play/pause state and controls |
| `components/ui/GatedPage.tsx` | Renders teaser / partial / full content based on `state` prop |
| `components/ui/Button.tsx` | Styled button with glow hover, primary + ghost variants |
| `components/ui/ScriptureStrip.tsx` | Adire-cloth divider with verse in gold script |
| `components/ui/AdireBackground.tsx` | Animated SVG adire texture, ~5% opacity, fixed behind all content |
| `components/ui/AudioToggle.tsx` | Floating persistent mute/unmute button, bottom-right corner |
| `components/layout/LenisProvider.tsx` | Client wrapper that initialises Lenis smooth scroll |
| `components/layout/Nav.tsx` | Top nav: logo link, page links, lock glyph for gated pages, mobile drawer |
| `components/layout/Footer.tsx` | Final verse, couple names, thank-you note |
| `app/layout.tsx` | Root layout: Google Fonts, LenisProvider, Nav, Footer, AudioToggle, AdireBackground |
| `app/globals.css` | Imports tokens.css, Tailwind directives, base html styles |
| `app/page.tsx` | Home / hero shell (hero built in Plan 2) |
| `app/our-story/page.tsx` | Our Story shell (built in Plan 2) |
| `app/love-letters/page.tsx` | Love Letters shell (built in Plan 3) |
| `app/schedule/page.tsx` | Schedule — Gate 1 wrapper with teaser (built in Plan 3) |
| `app/travel/page.tsx` | Travel — Gate 1 + Gate 2 wrapper (built in Plan 3) |
| `app/rsvp/page.tsx` | RSVP shell (built in Plan 4) |
| `app/gallery/page.tsx` | Gallery shell (built in Plan 5) |
| `app/guestbook/page.tsx` | Guestbook + Quiz shell (built in Plan 5) |
| `app/registry/page.tsx` | Registry shell (built in Plan 5) |
| `app/api/gate/route.ts` | GET: server-side gate check (used by client components needing gate state) |
| `vitest.config.ts` | Vitest + jsdom + React testing config |
| `vitest.setup.ts` | `@testing-library/jest-dom` global setup |
| `__tests__/lib/gate.test.ts` | Unit tests for `getPageAccess()` |
| `__tests__/components/GatedPage.test.tsx` | Component tests for `<GatedPage>` |

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: all Next.js scaffold files in project root

- [ ] **Step 1: Initialize the project**

```bash
cd "/Users/dimeji/docs/Wedding Website"
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --yes
```

Expected output: `Success! Created wedding-website at /Users/dimeji/docs/Wedding Website`

- [ ] **Step 2: Initialize git and add .gitignore entries**

```bash
git init
echo ".env.local" >> .gitignore
echo ".superpowers/" >> .gitignore
git add .
git commit -m "feat: initial Next.js 15 scaffold with TypeScript and Tailwind"
```

- [ ] **Step 3: Install production dependencies**

```bash
npm install \
  framer-motion \
  @studio-freight/lenis \
  react-hook-form \
  @hookform/resolvers \
  zod \
  @supabase/supabase-js \
  mapbox-gl \
  @types/mapbox-gl
```

- [ ] **Step 4: Install dev and test dependencies**

```bash
npm install -D \
  vitest \
  @vitejs/plugin-react \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom
```

- [ ] **Step 5: Add test scripts to package.json**

Open `package.json`. In the `"scripts"` object, add:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Commit dependencies**

```bash
git add package.json package-lock.json
git commit -m "feat: install deps — framer-motion, lenis, supabase, zod, react-hook-form, vitest"
```

---

### Task 2: Test infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Create vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 2: Create vitest setup file**

Create `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Verify the test runner starts**

```bash
npm run test:run
```

Expected: `No test files found` — no tests yet, that's correct.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json
git commit -m "feat: configure vitest with jsdom and react testing library"
```

---

### Task 3: Design token system

**Files:**
- Create: `config/tokens.css`
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Create CSS token file**

Create `config/tokens.css`:
```css
:root {
  /* ── Base ── */
  --color-ivory:   #FBF6F0;
  --color-blush:   #F7E8E4;
  --color-plum:    #231622;

  /* ── Yoruba Royal ── */
  --color-indigo:  #2C2A4A;
  --color-gold:    #C9A24B;

  /* ── Fantasy Glow ── */
  --color-rose:    #E6A9C0;
  --color-lilac:   #B9A6E0;

  /* ── Spacing ── */
  --space-1:   4px;
  --space-2:   8px;
  --space-4:   16px;
  --space-6:   24px;
  --space-10:  40px;
  --space-20:  80px;
  --space-32:  128px;

  /* ── Motion ── */
  --duration-fast:      150ms;
  --duration-base:      350ms;
  --duration-slow:      700ms;
  --duration-cinematic: 1200ms;
  --ease-silk:   cubic-bezier(0.22, 1, 0.36, 1);
  --ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 2: Replace globals.css**

Replace the entire contents of `app/globals.css`:
```css
@import '../config/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    background: var(--color-ivory);
    color: var(--color-plum);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

- [ ] **Step 3: Replace tailwind.config.ts**

Replace the entire contents of `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory:  'var(--color-ivory)',
        blush:  'var(--color-blush)',
        plum:   'var(--color-plum)',
        indigo: 'var(--color-indigo)',
        gold:   'var(--color-gold)',
        rose:   'var(--color-rose)',
        lilac:  'var(--color-lilac)',
      },
      transitionDuration: {
        fast:      '150ms',
        base:      '350ms',
        slow:      '700ms',
        cinematic: '1200ms',
      },
      transitionTimingFunction: {
        silk:   'cubic-bezier(0.22, 1, 0.36, 1)',
        gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        script:  ['var(--font-script)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Commit**

```bash
git add config/tokens.css app/globals.css tailwind.config.ts
git commit -m "feat: add design token system — colors, spacing, motion, typography"
```

---

### Task 4: Content config

**Files:**
- Create: `config/content.ts`

- [ ] **Step 1: Create content config**

Create `config/content.ts`:
```ts
export const COUPLE = {
  bride:        'Feyisogo',
  groom:        'Oladimeji',
  groomNick:    'Dimeji',
  displayNames: 'Feyisogo & Dimeji',
  fullNames:    'Feyisogo & Oladimeji',
  hashtag:      '[WEDDING_HASHTAG]',
} as const

export const WEDDING = {
  date:      new Date('2027-02-18T00:00:00Z'),
  dateLabel: 'February 18, 2027',
  venue:     '[VENUE_NAME]',
} as const

export const VERSES = {
  hero:     { text: '"He has made everything beautiful in its time."', ref: 'Ecclesiastes 3:11' },
  timeline: { text: '"Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken."', ref: 'Ecclesiastes 4:12' },
  rsvp:     { text: '"Love is patient, love is kind."', ref: '1 Corinthians 13:4' },
  schedule: { text: '"Where you go I will go, and where you stay I will stay."', ref: 'Ruth 1:16' },
  gallery:  { text: '"Many waters cannot quench love; rivers cannot sweep it away."', ref: 'Song of Solomon 8:7' },
  footer:   { text: '"Many waters cannot quench love; rivers cannot sweep it away."', ref: 'Song of Solomon 8:7' },
} as const

export const STORY_MILESTONES = [
  {
    id: 'ch1',
    chapter: 'Chapter One',
    title: 'A Hello That Changed Everything',
    date: 'April 2018 · Covenant University',
    body: `Our story began at Covenant University. Before we ever spoke, Feyisogo noticed Oladimeji during a communion service at the university chapel. On April 8, 2018, after a chapel service, Oladimeji walked over, complimented Feyisogo's outfit, and introduced himself. They exchanged Instagram handles — unfortunately, he forgot to save hers. Almost three weeks later, on the final day of the semester, Feyisogo decided to send him a message herself. That single Instagram message turned into a conversation that lasted nearly five hours.`,
    photo: '[STORY_PHOTO_1]',
  },
  {
    id: 'ch2',
    chapter: 'Chapter Two',
    title: 'Choosing Friendship First',
    date: '2018',
    body: `Some months later, Oladimeji expressed that he wanted something more. Feyisogo wasn't ready. Life was taking them in different directions — he was graduating, while she still had years left at university. Instead of forcing timing, they chose friendship. It turned out to be one of the best decisions they could have made. They remained good friends even after Oladimeji finished school and relocated to Germany.`,
    photo: '[STORY_PHOTO_2]',
  },
  {
    id: 'ch3',
    chapter: 'Chapter Three',
    title: '[CHAPTER_3_TITLE]',
    date: '[CHAPTER_3_DATE]',
    body: '[CHAPTER_3_BODY]',
    photo: '[STORY_PHOTO_3]',
  },
  {
    id: 'ch4',
    chapter: 'Chapter Four',
    title: 'From Screens to Shared Moments',
    date: 'December 2023 · Germany',
    body: `After five years apart, Feyisogo boarded a flight to Germany. She remembers feeling nervous from the moment she landed. Then came the hug — the kind that makes time stand still. Neither wanted to let go. The visit became a glimpse into what everyday life together could look like.`,
    photo: '[STORY_PHOTO_4]',
  },
  {
    id: 'ch5',
    chapter: 'Chapter Five',
    title: 'Building Something Real',
    date: '2024',
    body: `Throughout 2024, Oladimeji travelled to the United States twice. Together they explored cities, created memories, met one another's families, and slowly answered the question: "Could this really become forever?" There was no pressure. Just intentional time spent learning one another beyond phone calls and video chats.`,
    photo: '[STORY_PHOTO_5]',
  },
  {
    id: 'ch6',
    chapter: 'Chapter Six',
    title: 'We Finally Said Yes',
    date: 'January 2025',
    body: `On New Year's Eve, while visiting the Museum of the Bible in Washington D.C., the conversation naturally turned toward the future. Before returning to Germany, Oladimeji asked Feyisogo to be his girlfriend. On January 2, 2025, she said yes. After nearly seven years of friendship, patience, growth, and countless miles between them, they officially became a couple.`,
    photo: '[STORY_PHOTO_6]',
  },
  {
    id: 'ch7',
    chapter: 'Chapter Seven',
    title: 'Long Distance, Closer Than Ever',
    date: '2025',
    body: `Their first year together was still long-distance. Yet somehow, they had never felt closer. Every day was filled with conversations, movie nights across time zones, shared prayers, and worship sessions together. One day, Feyisogo accidentally discovered something that perfectly captured Oladimeji's heart — he had quietly been building a wedding playlist since April 2024.`,
    photo: '[STORY_PHOTO_7]',
  },
  {
    id: 'ch8',
    chapter: 'Chapter Eight',
    title: 'Closing the Distance',
    date: 'January 2026',
    body: `Feyisogo relocated to Germany. After seven years of different countries, airports, video calls, and countdowns, they were finally living in the same place. Home was no longer measured by geography. Home had become each other.`,
    photo: '[STORY_PHOTO_8]',
  },
  {
    id: 'ch9',
    chapter: 'Chapter Nine',
    title: 'Two Families, One Future',
    date: 'February 2026 · Lagos, Nigeria',
    body: `In February 2026, they travelled together to Lagos, Nigeria. For the first time, both families spent meaningful time together. What had once been two separate families was beginning to become one.`,
    photo: '[STORY_PHOTO_9]',
  },
  {
    id: 'ch10',
    chapter: 'Chapter Ten',
    title: 'The Easiest Yes',
    date: 'March 2026 · Mallorca, Spain',
    body: `During a trip to Mallorca, Oladimeji planned a quiet picnic overlooking a vineyard. There he asked the question that had been years in the making. She said yes.`,
    photo: '[STORY_PHOTO_10]',
  },
] as const

export const EVENTS = [
  {
    id: 'traditional',
    name: 'Traditional Engagement',
    date: '[TRADITIONAL_DATE]',
    time: '[TRADITIONAL_TIME]',
    location: '[TRADITIONAL_VENUE]',
    dresscode: '[TRADITIONAL_DRESSCODE]',
    note: 'The traditional Yoruba engagement ceremony (introduction) is a joyful celebration where two families formally meet and the groom\'s family presents gifts to the bride\'s family.',
  },
  {
    id: 'ceremony',
    name: 'Church Ceremony',
    date: 'February 18, 2027',
    time: '[CEREMONY_TIME]',
    location: '[CEREMONY_VENUE]',
    dresscode: '[CEREMONY_DRESSCODE]',
    note: '',
  },
  {
    id: 'reception',
    name: 'Reception',
    date: 'February 18, 2027',
    time: '[RECEPTION_TIME]',
    location: '[RECEPTION_VENUE]',
    dresscode: '[RECEPTION_DRESSCODE]',
    note: 'Aso-ebi (coordinated family fabric) details will be shared with confirmed guests.',
  },
] as const

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Where did Feyisogo and Dimeji first meet?',
    options: ['A library', 'Covenant University chapel', 'A mutual friend\'s party', 'Online'],
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
] as const

export const AUDIO = {
  src:    '/audio/cant-help-falling-in-love.mp3',
  title:  "Can't Help Falling in Love",
  artist: 'Elvis Presley',
} as const

export const NAV_LINKS = [
  { label: 'Our Story',    href: '/our-story',     gated: false },
  { label: 'Love Letters', href: '/love-letters',  gated: false },
  { label: 'Schedule',     href: '/schedule',      gated: true  },
  { label: 'Travel',       href: '/travel',        gated: true  },
  { label: 'RSVP',         href: '/rsvp',          gated: false },
  { label: 'Gallery',      href: '/gallery',       gated: false },
  { label: 'Guestbook',    href: '/guestbook',     gated: false },
  { label: 'Registry',     href: '/registry',      gated: false },
] as const
```

- [ ] **Step 2: Commit**

```bash
git add config/content.ts
git commit -m "feat: add content config with all copy, milestones, events, verses, quiz questions"
```

---

### Task 5: Reveal config and gate logic (TDD)

**Files:**
- Create: `config/reveal.ts`
- Create: `lib/gate.ts`
- Create: `__tests__/lib/gate.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `__tests__/lib/gate.test.ts`:
```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { getPageAccess } from '@/lib/gate'

describe('getPageAccess', () => {
  afterEach(() => vi.useRealTimers())

  it('returns teaser state when current date is before unlock date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const result = getPageAccess('schedule')
    expect(result.state).toBe('teaser')
  })

  it('includes unlocksAt date when in teaser state', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const result = getPageAccess('schedule')
    expect(result.unlocksAt).toBeInstanceOf(Date)
  })

  it('returns full state for schedule when date has passed', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('schedule')
    expect(result.state).toBe('full')
  })

  it('returns partial state for travel when date passed but rsvp is not_attending', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('travel', 'not_attending')
    expect(result.state).toBe('partial')
  })

  it('returns partial state for travel when date passed and no rsvp status provided', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('travel', undefined)
    expect(result.state).toBe('partial')
  })

  it('returns full state for travel when date passed and rsvp is attending', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('travel', 'attending')
    expect(result.state).toBe('full')
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run
```

Expected: FAIL with `Cannot find module '@/lib/gate'`

- [ ] **Step 3: Create reveal config**

Create `config/reveal.ts`:
```ts
export const UNLOCK_DATES = {
  schedule: new Date('2026-11-20T00:00:00Z'),
  travel:   new Date('2026-11-20T00:00:00Z'),
} as const

export type GatedPage = keyof typeof UNLOCK_DATES
```

- [ ] **Step 4: Implement gate logic**

Create `lib/gate.ts`:
```ts
import { UNLOCK_DATES, type GatedPage } from '@/config/reveal'

export type GateState = 'teaser' | 'partial' | 'full'

export interface PageAccess {
  state:      GateState
  unlocksAt?: Date
}

export function getPageAccess(page: GatedPage, rsvpStatus?: string): PageAccess {
  const now        = new Date()
  const unlockDate = UNLOCK_DATES[page]

  if (now < unlockDate) {
    return { state: 'teaser', unlocksAt: unlockDate }
  }

  if (page === 'travel' && rsvpStatus !== 'attending') {
    return { state: 'partial' }
  }

  return { state: 'full' }
}
```

- [ ] **Step 5: Run tests — confirm they all pass**

```bash
npm run test:run
```

Expected: 6 tests PASS, 0 FAIL

- [ ] **Step 6: Commit**

```bash
git add config/reveal.ts lib/gate.ts __tests__/lib/gate.test.ts
git commit -m "feat: add server-side gate logic with time + rsvp access control (TDD, 6 tests)"
```

---

### Task 6: Supabase client

**Files:**
- Create: `lib/supabase.ts`
- Create: `.env.local` (never committed — already in .gitignore)

- [ ] **Step 1: Create .env.local**

Create `.env.local` (do not commit this file):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
PREVIEW_TOKEN=generate_a_random_32_character_string_here
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token_here
```

Find your Supabase values at: Supabase Dashboard → Project Settings → API.
Generate a preview token with: `openssl rand -hex 16`

- [ ] **Step 2: Create Supabase client**

Create `lib/supabase.ts`:
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables — check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
```

- [ ] **Step 3: Commit (without .env.local)**

```bash
git add lib/supabase.ts
git commit -m "feat: add Supabase client singleton"
```

---

### Task 7: GatedPage component (TDD)

**Files:**
- Create: `components/ui/GatedPage.tsx`
- Create: `__tests__/components/GatedPage.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/components/GatedPage.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GatedPage } from '@/components/ui/GatedPage'

describe('GatedPage', () => {
  const teaser  = <div>Teaser content</div>
  const partial = <div>Partial content</div>
  const full    = <div>Full secret content</div>

  it('renders teaser and hides children when state is teaser', () => {
    render(
      <GatedPage state="teaser" teaserContent={teaser} unlocksAt={new Date('2027-01-01')}>
        {full}
      </GatedPage>
    )
    expect(screen.getByText('Teaser content')).toBeInTheDocument()
    expect(screen.queryByText('Full secret content')).not.toBeInTheDocument()
  })

  it('renders children and hides teaser when state is full', () => {
    render(
      <GatedPage state="full" teaserContent={teaser}>
        {full}
      </GatedPage>
    )
    expect(screen.getByText('Full secret content')).toBeInTheDocument()
    expect(screen.queryByText('Teaser content')).not.toBeInTheDocument()
  })

  it('renders partialContent when state is partial', () => {
    render(
      <GatedPage state="partial" teaserContent={teaser} partialContent={partial}>
        {full}
      </GatedPage>
    )
    expect(screen.getByText('Partial content')).toBeInTheDocument()
    expect(screen.queryByText('Full secret content')).not.toBeInTheDocument()
    expect(screen.queryByText('Teaser content')).not.toBeInTheDocument()
  })

  it('falls back to teaserContent when state is partial and no partialContent given', () => {
    render(
      <GatedPage state="partial" teaserContent={teaser}>
        {full}
      </GatedPage>
    )
    expect(screen.getByText('Teaser content')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:run
```

Expected: FAIL with `Cannot find module '@/components/ui/GatedPage'`

- [ ] **Step 3: Implement the component**

Create `components/ui/GatedPage.tsx`:
```tsx
import type { ReactNode } from 'react'
import type { GateState } from '@/lib/gate'

interface GatedPageProps {
  state:          GateState
  unlocksAt?:     Date
  teaserContent:  ReactNode
  partialContent?: ReactNode
  children:       ReactNode
}

export function GatedPage({
  state,
  teaserContent,
  partialContent,
  children,
}: GatedPageProps) {
  if (state === 'teaser')  return <>{teaserContent}</>
  if (state === 'partial') return <>{partialContent ?? teaserContent}</>
  return <>{children}</>
}
```

- [ ] **Step 4: Run tests — confirm all pass**

```bash
npm run test:run
```

Expected: 10 tests PASS (6 gate + 4 GatedPage), 0 FAIL

- [ ] **Step 5: Commit**

```bash
git add components/ui/GatedPage.tsx __tests__/components/GatedPage.test.tsx
git commit -m "feat: add GatedPage wrapper component with teaser/partial/full states (TDD, 4 tests)"
```

---

### Task 8: Reduced motion hook

**Files:**
- Create: `lib/hooks/useReducedMotion.ts`

- [ ] **Step 1: Create hook**

Create `lib/hooks/useReducedMotion.ts`:
```ts
'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/hooks/useReducedMotion.ts
git commit -m "feat: add useReducedMotion hook"
```

---

### Task 9: Audio hook and AudioToggle

**Files:**
- Create: `lib/hooks/useAudio.ts`
- Create: `components/ui/AudioToggle.tsx`

- [ ] **Step 1: Create the audio hook**

Create `lib/hooks/useAudio.ts`:
```ts
'use client'

import { useEffect, useRef, useState } from 'react'

interface UseAudioOptions {
  src:   string
  loop?: boolean
}

export function useAudio({ src, loop = true }: UseAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    audioRef.current      = new Audio(src)
    audioRef.current.loop = loop
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [src, loop])

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {
        // Browser autoplay policy — user must interact first; silent fail is correct
      })
      setPlaying(true)
    }
  }

  return { playing, toggle }
}
```

- [ ] **Step 2: Create the AudioToggle component**

Create `components/ui/AudioToggle.tsx`:
```tsx
'use client'

import { useAudio } from '@/lib/hooks/useAudio'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { AUDIO } from '@/config/content'

export function AudioToggle() {
  const { playing, toggle } = useAudio({ src: AUDIO.src })
  const reduced             = useReducedMotion()

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Mute music' : 'Play music'}
      title={playing
        ? `Mute — ${AUDIO.title} by ${AUDIO.artist}`
        : `Play — ${AUDIO.title} by ${AUDIO.artist}`
      }
      className={[
        'fixed bottom-6 right-6 z-50',
        'w-10 h-10 rounded-full',
        'border border-gold/40 bg-plum/80 backdrop-blur-sm',
        'flex items-center justify-center text-gold',
        'hover:text-rose hover:border-gold',
        'hover:shadow-[0_0_16px_rgba(230,169,192,0.35)]',
        'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-plum',
        reduced ? '' : 'transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110',
      ].join(' ')}
    >
      {playing ? (
        /* Pause icon */
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <rect x="2" y="2" width="3.5" height="10" rx="1"/>
          <rect x="8.5" y="2" width="3.5" height="10" rx="1"/>
        </svg>
      ) : (
        /* Play icon */
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <path d="M3 2.5v9a.5.5 0 0 0 .757.429l7-4.5a.5.5 0 0 0 0-.858l-7-4.5A.5.5 0 0 0 3 2.5z"/>
        </svg>
      )}
    </button>
  )
}
```

- [ ] **Step 3: Create the audio placeholder directory**

```bash
mkdir -p public/audio
touch public/audio/.gitkeep
echo "# Drop cant-help-falling-in-love.mp3 here" > public/audio/README.md
```

- [ ] **Step 4: Commit**

```bash
git add lib/hooks/useAudio.ts components/ui/AudioToggle.tsx public/audio/
git commit -m "feat: add audio hook and floating AudioToggle component with play/pause"
```

---

### Task 10: AdireBackground and ScriptureStrip

**Files:**
- Create: `components/ui/AdireBackground.tsx`
- Create: `components/ui/ScriptureStrip.tsx`

- [ ] **Step 1: Create the AdireBackground**

Create `components/ui/AdireBackground.tsx`:
```tsx
'use client'

import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export function AdireBackground() {
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-plum"
    >
      <svg
        width="200%"
        height="200%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 opacity-[0.05]"
        style={reduced
          ? {}
          : { animation: 'adireDrift 60s linear infinite' }
        }
      >
        <defs>
          <pattern
            id="adire-pattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth="0.4"/>
            <circle cx="30" cy="30" r="5"  fill="none" stroke="currentColor" strokeWidth="0.4"/>
            <line x1="8"  y1="30" x2="52" y2="30" stroke="currentColor" strokeWidth="0.3"/>
            <line x1="30" y1="8"  x2="30" y2="52" stroke="currentColor" strokeWidth="0.3"/>
            <line x1="13" y1="13" x2="47" y2="47" stroke="currentColor" strokeWidth="0.25"/>
            <line x1="47" y1="13" x2="13" y2="47" stroke="currentColor" strokeWidth="0.25"/>
            <ellipse cx="0"  cy="0"  rx="3.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="0.35"/>
            <ellipse cx="60" cy="0"  rx="3.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="0.35"/>
            <ellipse cx="0"  cy="60" rx="3.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="0.35"/>
            <ellipse cx="60" cy="60" rx="3.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="0.35"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#adire-pattern)"/>
      </svg>

      <style>{`
        @keyframes adireDrift {
          0%   { transform: translate(0px, 0px); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 2: Create the ScriptureStrip**

Create `components/ui/ScriptureStrip.tsx`:
```tsx
interface ScriptureStripProps {
  text:      string
  reference: string
}

export function ScriptureStrip({ text, reference }: ScriptureStripProps) {
  return (
    <aside
      className="relative w-full py-8 px-6 my-16 overflow-hidden"
      aria-label={`Scripture: ${reference}`}
    >
      {/* Gold hairline top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"/>
      {/* Gold hairline bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"/>

      <div className="relative text-center max-w-2xl mx-auto">
        <p className="font-script italic text-lg leading-relaxed text-gold/75">
          {text}
        </p>
        <p className="mt-3 font-sans font-medium text-[10px] tracking-[0.18em] uppercase text-gold/45">
          {reference}
        </p>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/AdireBackground.tsx components/ui/ScriptureStrip.tsx
git commit -m "feat: add AdireBackground SVG texture and ScriptureStrip verse divider"
```

---

### Task 11: Button component

**Files:**
- Create: `components/ui/Button.tsx`

- [ ] **Step 1: Create Button**

Create `components/ui/Button.tsx`:
```tsx
'use client'

import type { ButtonHTMLAttributes } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const reduced = useReducedMotion()

  const base = `
    inline-flex items-center justify-center gap-2
    px-6 py-3 rounded-sm border
    font-sans text-[11px] font-medium tracking-[0.16em] uppercase
    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
    ${reduced ? '' : 'transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)]'}
  `

  const variants = {
    primary: `
      border-gold/50 text-gold bg-transparent
      hover:border-gold hover:scale-[1.02]
      hover:shadow-[0_0_20px_rgba(201,162,75,0.2)]
    `,
    ghost: `
      border-transparent text-ivory/60 bg-transparent
      hover:text-ivory hover:border-ivory/20
    `,
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/Button.tsx
git commit -m "feat: add Button component with primary/ghost variants and glow hover"
```

---

### Task 12: Navigation with mobile drawer

**Files:**
- Create: `components/layout/Nav.tsx`

- [ ] **Step 1: Create Nav**

Create `components/layout/Nav.tsx`:
```tsx
'use client'

import Link             from 'next/link'
import { usePathname }  from 'next/navigation'
import { useState }     from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS, COUPLE } from '@/config/content'
import { UNLOCK_DATES }      from '@/config/reveal'
import { useReducedMotion }  from '@/lib/hooks/useReducedMotion'

function isGateLocked(href: string): boolean {
  const key = href.replace('/', '') as keyof typeof UNLOCK_DATES
  if (!(key in UNLOCK_DATES)) return false
  return new Date() < UNLOCK_DATES[key]
}

function unlockLabel(href: string): string {
  const key  = href.replace('/', '') as keyof typeof UNLOCK_DATES
  const date = UNLOCK_DATES[key]
  return `Unlocks ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

const LockIcon = () => (
  <svg
    width="9" height="9" viewBox="0 0 12 14"
    fill="currentColor" aria-hidden="true"
    className="inline ml-1 opacity-40"
  >
    <path d="M10 6V5a4 4 0 1 0-8 0v1H1v8h10V6h-1ZM5 5a1 1 0 1 1 2 0v1H5V5Z"/>
  </svg>
)

export function Nav() {
  const pathname  = usePathname()
  const reduced   = useReducedMotion()
  const [open, setOpen] = useState(false)

  const linkClass = (href: string) => [
    'relative text-[11px] font-sans font-medium tracking-[0.16em] uppercase',
    reduced ? '' : 'transition-colors duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    pathname === href ? 'text-gold' : 'text-ivory/55 hover:text-ivory',
    'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold after:origin-left',
    reduced ? 'after:scale-x-0' : 'after:transition-transform after:duration-[350ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]',
    pathname === href ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
  ].join(' ')

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-plum/90 backdrop-blur-md border-b border-gold/10">
        <nav
          className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className={[
              'font-script italic text-gold text-lg tracking-wide',
              'hover:text-rose',
              reduced ? '' : 'transition-colors duration-[150ms]',
            ].join(' ')}
          >
            {COUPLE.displayNames}
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {NAV_LINKS.map(({ label, href, gated }) => {
              const locked = gated ? isGateLocked(href) : false
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={locked ? unlockLabel(href) : undefined}
                    aria-current={pathname === href ? 'page' : undefined}
                    className={linkClass(href)}
                  >
                    {label}
                    {locked && <LockIcon/>}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-ivory/60 hover:text-ivory p-1"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={reduced ? { opacity: 1 } : { opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: '100%' }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-30 w-72 bg-plum border-l border-gold/10 pt-20 px-8 md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-6" role="list">
              {NAV_LINKS.map(({ label, href, gated }) => {
                const locked = gated ? isGateLocked(href) : false
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      title={locked ? unlockLabel(href) : undefined}
                      aria-current={pathname === href ? 'page' : undefined}
                      className={[
                        'text-sm font-sans font-medium tracking-[0.14em] uppercase',
                        pathname === href ? 'text-gold' : 'text-ivory/60 hover:text-ivory',
                        reduced ? '' : 'transition-colors duration-[150ms]',
                      ].join(' ')}
                    >
                      {label}
                      {locked && <LockIcon/>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed inset-0 z-20 bg-plum/60 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Nav.tsx
git commit -m "feat: add Nav with lock glyphs, desktop links, and mobile slide-out drawer"
```

---

### Task 13: Footer

**Files:**
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Create Footer**

Create `components/layout/Footer.tsx`:
```tsx
import { COUPLE, VERSES, WEDDING } from '@/config/content'

export function Footer() {
  return (
    <footer className="relative bg-plum text-ivory/50 py-20 px-6 overflow-hidden">
      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent"/>

      <div className="relative max-w-xl mx-auto text-center space-y-4">
        <p className="font-script italic text-gold/70 text-xl leading-relaxed">
          {VERSES.footer.text}
        </p>
        <p className="font-sans font-medium text-[10px] tracking-[0.18em] uppercase text-gold/40">
          {VERSES.footer.ref}
        </p>

        <div className="pt-10 mt-10 border-t border-white/5 space-y-2">
          <p className="font-display text-ivory/80 text-2xl tracking-wide">
            {COUPLE.fullNames}
          </p>
          <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-ivory/30">
            {WEDDING.dateLabel}
          </p>
          <p className="font-sans text-xs text-ivory/20 pt-2">
            With love and gratitude — thank you for celebrating with us.
          </p>
          {COUPLE.hashtag !== '[WEDDING_HASHTAG]' && (
            <p className="font-sans text-xs tracking-widest text-gold/35 pt-1">
              {COUPLE.hashtag}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat: add Footer with verse, couple names, and wedding date"
```

---

### Task 14: Lenis smooth scroll provider

**Files:**
- Create: `components/layout/LenisProvider.tsx`

- [ ] **Step 1: Create LenisProvider**

Create `components/layout/LenisProvider.tsx`:
```tsx
'use client'

import { useEffect } from 'react'
import Lenis         from '@studio-freight/lenis'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration:  1.2,
      easing:    (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let raf: number
    function tick(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/LenisProvider.tsx
git commit -m "feat: add Lenis smooth scroll provider, disabled when prefers-reduced-motion"
```

---

### Task 15: Root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace root layout**

Replace the entire contents of `app/layout.tsx`:
```tsx
import type { Metadata }           from 'next'
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { Nav }             from '@/components/layout/Nav'
import { Footer }          from '@/components/layout/Footer'
import { LenisProvider }   from '@/components/layout/LenisProvider'
import { AudioToggle }     from '@/components/ui/AudioToggle'
import { AdireBackground } from '@/components/ui/AdireBackground'
import { COUPLE }          from '@/config/content'

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
})

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300'],
  style:    ['normal', 'italic'],
  variable: '--font-script',
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
})

export const metadata: Metadata = {
  title:       `${COUPLE.displayNames} — Wedding`,
  description: `You're invited to celebrate the wedding of ${COUPLE.fullNames} on February 18, 2027.`,
  openGraph: {
    title:       `${COUPLE.displayNames} — Wedding`,
    description: `You're invited to celebrate the wedding of ${COUPLE.fullNames}.`,
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body className="bg-ivory text-plum min-h-screen">
        <AdireBackground />
        <LenisProvider>
          <Nav />
          <main className="relative z-10 pt-16" id="main-content">
            {children}
          </main>
          <Footer />
        </LenisProvider>
        <AudioToggle />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire root layout with fonts, Lenis, Nav, Footer, AdireBackground, AudioToggle"
```

---

### Task 16: Page shells and API route

**Files:**
- Modify: `app/page.tsx`
- Create: `app/our-story/page.tsx`
- Create: `app/love-letters/page.tsx`
- Create: `app/schedule/page.tsx`
- Create: `app/travel/page.tsx`
- Create: `app/rsvp/page.tsx`
- Create: `app/gallery/page.tsx`
- Create: `app/guestbook/page.tsx`
- Create: `app/registry/page.tsx`
- Create: `app/api/gate/route.ts`

- [ ] **Step 1: Home page shell**

Replace `app/page.tsx`:
```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-plum flex flex-col items-center justify-center gap-4">
      <p className="font-display text-gold/40 text-4xl">Feyisogo & Dimeji</p>
      <p className="font-sans text-ivory/20 text-xs tracking-[0.16em] uppercase">
        Hero — Plan 2
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Our Story shell**

Create `app/our-story/page.tsx`:
```tsx
export default function OurStoryPage() {
  return (
    <div className="min-h-screen py-32 px-6 text-center">
      <h1 className="font-display text-4xl text-plum">Our Story</h1>
      <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">Timeline — Plan 2</p>
    </div>
  )
}
```

- [ ] **Step 3: Love Letters shell**

Create `app/love-letters/page.tsx`:
```tsx
export default function LoveLettersPage() {
  return (
    <div className="min-h-screen py-32 px-6 text-center">
      <h1 className="font-display text-4xl text-plum">Love Letters</h1>
      <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">Scrapbook — Plan 3</p>
    </div>
  )
}
```

- [ ] **Step 4: Schedule page with Gate 1**

Create `app/schedule/page.tsx`:
```tsx
import { getPageAccess }  from '@/lib/gate'
import { GatedPage }      from '@/components/ui/GatedPage'
import { UNLOCK_DATES }   from '@/config/reveal'

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
      <div className="min-h-screen py-32 px-6 text-center">
        <h1 className="font-display text-4xl text-plum">Schedule</h1>
        <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">Event blocks — Plan 3</p>
      </div>
    </GatedPage>
  )
}
```

- [ ] **Step 5: Travel page with Gate 1 + Gate 2**

Create `app/travel/page.tsx`:
```tsx
import { getPageAccess }  from '@/lib/gate'
import { GatedPage }      from '@/components/ui/GatedPage'
import { UNLOCK_DATES }   from '@/config/reveal'

export default function TravelPage() {
  // rsvpStatus will come from a cookie/session lookup added in Plan 4
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
    <div className="min-h-screen py-32 px-6 text-center">
      <h1 className="font-display text-4xl text-plum">Travel</h1>
      <p className="font-sans text-plum/40 text-sm mt-4">General location info is shown here.</p>
      <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-2">
        RSVP to unlock full address &amp; hotel details — Plan 3
      </p>
    </div>
  )

  return (
    <GatedPage
      state={access.state}
      unlocksAt={access.unlocksAt}
      teaserContent={teaser}
      partialContent={partial}
    >
      <div className="min-h-screen py-32 px-6 text-center">
        <h1 className="font-display text-4xl text-plum">Travel</h1>
        <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">
          Full map + details — Plan 3
        </p>
      </div>
    </GatedPage>
  )
}
```

- [ ] **Step 6: Remaining page shells**

Create `app/rsvp/page.tsx`:
```tsx
export default function RSVPPage() {
  return (
    <div className="min-h-screen py-32 px-6 text-center">
      <h1 className="font-display text-4xl text-plum">RSVP</h1>
      <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">Multi-step form — Plan 4</p>
    </div>
  )
}
```

Create `app/gallery/page.tsx`:
```tsx
export default function GalleryPage() {
  return (
    <div className="min-h-screen py-32 px-6 text-center">
      <h1 className="font-display text-4xl text-plum">Gallery</h1>
      <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">Masonry gallery — Plan 5</p>
    </div>
  )
}
```

Create `app/guestbook/page.tsx`:
```tsx
export default function GuestbookPage() {
  return (
    <div className="min-h-screen py-32 px-6 text-center">
      <h1 className="font-display text-4xl text-plum">Guestbook & Quiz</h1>
      <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">Guestbook + leaderboard — Plan 5</p>
    </div>
  )
}
```

Create `app/registry/page.tsx`:
```tsx
export default function RegistryPage() {
  return (
    <div className="min-h-screen py-32 px-6 text-center">
      <h1 className="font-display text-4xl text-plum">Registry</h1>
      <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">Gift links — Plan 5</p>
    </div>
  )
}
```

- [ ] **Step 7: Create gate check API route**

Create `app/api/gate/route.ts`:
```ts
import { NextRequest, NextResponse }    from 'next/server'
import { getPageAccess }                from '@/lib/gate'
import type { GatedPage }               from '@/config/reveal'

const VALID_PAGES: GatedPage[] = ['schedule', 'travel']

export async function GET(request: NextRequest) {
  const page       = request.nextUrl.searchParams.get('page') as GatedPage | null
  const rsvpStatus = request.nextUrl.searchParams.get('rsvpStatus') ?? undefined

  if (!page || !VALID_PAGES.includes(page)) {
    return NextResponse.json(
      { error: 'Invalid page parameter. Must be "schedule" or "travel".' },
      { status: 400 }
    )
  }

  const access = getPageAccess(page, rsvpStatus)
  return NextResponse.json(access)
}
```

- [ ] **Step 8: Run all tests**

```bash
npm run test:run
```

Expected: 10 tests PASS, 0 FAIL

- [ ] **Step 9: Start dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- [ ] Dark navy nav bar at top with "Feyisogo & Dimeji" in italic gold script
- [ ] All 8 nav links visible; Schedule and Travel show a small lock icon
- [ ] Home page shows dark background with placeholder text
- [ ] Navigate to `/schedule` — should show the teaser ("The path to us is still being written") because the unlock date is in the future
- [ ] Navigate to `/travel` — same teaser state
- [ ] Navigate to `/our-story`, `/rsvp`, `/gallery`, `/guestbook`, `/registry` — all show their placeholder headings
- [ ] Footer shows the Song of Solomon verse and couple names
- [ ] Floating audio toggle button appears bottom-right (clicking it tries to play `/audio/cant-help-falling-in-love.mp3` which doesn't exist yet — that's fine, it fails silently)
- [ ] Adire SVG pattern faintly visible in the background
- [ ] On mobile (resize to 390px): hamburger button appears; tapping it opens the slide-out drawer

- [ ] **Step 10: Final commit**

```bash
git add app/
git commit -m "feat: add all page shells, gated schedule/travel pages, and gate check API route"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered in task |
|-----------------|----------------|
| Next.js App Router + TypeScript | Task 1 |
| Tailwind CSS + CSS variables for design tokens | Task 3 |
| Framer Motion installed | Task 1 |
| Lenis smooth scroll | Task 14 |
| Design token system (colors, spacing, motion) | Task 3 |
| All copy in central `config/content.ts` | Task 4 |
| Gate unlock dates in `config/reveal.ts` | Task 5 |
| `getPageAccess()` server-side only, never trusts client clock | Task 5 |
| Gate checks in Next.js Server Components | Tasks 5, 16 |
| `<GatedPage state="teaser\|partial\|full">` wrapper | Task 7 |
| Supabase client | Task 6 |
| `prefers-reduced-motion` hook | Task 8 |
| Audio infrastructure with placeholder slot | Task 9 |
| Animated adire SVG texture ~5% opacity | Task 10 |
| Scripture strip divider component | Task 10 |
| Button with glow hover | Task 11 |
| Nav with lock glyph + tooltip for gated pages | Task 12 |
| Mobile-first nav (hamburger + drawer) | Task 12 |
| Footer with verse, couple names, thank-you | Task 13 |
| Root layout: fonts, Lenis, Nav, Footer, AudioToggle | Tasks 14–15 |
| Page shells for all 9 routes | Task 16 |
| Gate 1 teaser for Schedule and Travel | Task 16 |
| Gate 2 partial state for Travel | Task 16 |
| Gate check API route | Task 16 |
| TDD for gate logic (6 tests) | Task 5 |
| TDD for GatedPage component (4 tests) | Task 7 |

**No spec gaps found for Plan 1 scope.**

**Type consistency confirmed:** `GatedPage` type from `config/reveal.ts`, `GateState` and `PageAccess` from `lib/gate.ts` — used consistently across `GatedPage.tsx`, `schedule/page.tsx`, `travel/page.tsx`, and `api/gate/route.ts`.

**No placeholder steps** — every step contains complete code or exact commands.
