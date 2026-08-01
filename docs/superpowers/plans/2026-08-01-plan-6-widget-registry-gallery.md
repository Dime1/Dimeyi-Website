# Widget, Registry & Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating quiz widget (bottom-left, slide-up drawer), rename the guestbook page to "Ode to the Couple", replace the registry list with 3D flip cards, and update gallery filter tabs to 3 categories.

**Architecture:** Four independent changes that share no cross-task dependencies — execute them in order. The quiz widget is a new `'use client'` component mounted in `app/layout.tsx`; the registry flip card replaces `RegistrySection` entirely; the gallery category rename touches only content config and the filter tabs component.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion (already installed), Vitest + Testing Library

---

## File Map

**Create:**
- `features/quiz-widget/QuizWidgetButton.tsx` — floating trophy button + slide-up quiz drawer
- `__tests__/features/quiz-widget/QuizWidgetButton.test.tsx`

**Modify:**
- `config/content.ts` — gallery categories + nav label
- `app/guestbook/page.tsx` — remove quiz section, rename headings
- `features/gallery/GalleryFilterTabs.tsx` — 3 tabs instead of 4
- `features/registry/RegistrySection.tsx` — full replacement with flip cards (`'use client'`)
- `app/layout.tsx` — mount `<QuizWidgetButton />`
- `__tests__/features/gallery/GalleryFilterTabs.test.tsx` — update for 3 tabs
- `__tests__/features/gallery/GalleryGrid.test.tsx` — update mocked categories
- `__tests__/features/registry/RegistrySection.test.tsx` — full replacement

---

## Task 1: Update Gallery Categories in Config and Tabs

**Files:**
- Modify: `config/content.ts`
- Modify: `features/gallery/GalleryFilterTabs.tsx`
- Modify: `__tests__/features/gallery/GalleryFilterTabs.test.tsx`
- Modify: `__tests__/features/gallery/GalleryGrid.test.tsx`

- [ ] **Step 1: Update the failing tests first**

Replace `__tests__/features/gallery/GalleryFilterTabs.test.tsx` entirely:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryFilterTabs } from '@/features/gallery/GalleryFilterTabs'

describe('GalleryFilterTabs', () => {
  it('renders all three tabs', () => {
    render(<GalleryFilterTabs active="all" onChange={vi.fn()} />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('marks the active tab as selected', () => {
    render(<GalleryFilterTabs active="couple-journey" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Couple Journey' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange with couple-journey when that tab is clicked', () => {
    const onChange = vi.fn()
    render(<GalleryFilterTabs active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Couple Journey' }))
    expect(onChange).toHaveBeenCalledWith('couple-journey')
  })

  it('calls onChange with proposal when that tab is clicked', () => {
    const onChange = vi.fn()
    render(<GalleryFilterTabs active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Proposal Photos' }))
    expect(onChange).toHaveBeenCalledWith('proposal')
  })
})
```

Replace `__tests__/features/gallery/GalleryGrid.test.tsx` entirely:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

vi.mock('@/config/content', () => ({
  GALLERY_IMAGES: [
    { id: 'g1', src: '/img/p1.jpg', alt: 'Photo 1', category: 'couple-journey' },
    { id: 'g2', src: '/img/p2.jpg', alt: 'Photo 2', category: 'proposal'       },
    { id: 'g3', src: '/img/p3.jpg', alt: 'Photo 3', category: 'couple-journey' },
  ],
}))

describe('GalleryGrid', () => {
  it('renders all images when filter is All', () => {
    render(<GalleryGrid />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
    expect(screen.getByAltText('Photo 2')).toBeInTheDocument()
    expect(screen.getByAltText('Photo 3')).toBeInTheDocument()
  })

  it('filters to couple-journey only', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByRole('tab', { name: 'Couple Journey' }))
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
    expect(screen.queryByAltText('Photo 2')).not.toBeInTheDocument()
  })

  it('opens lightbox when an image button is clicked', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByRole('button', { name: 'Photo 1' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes lightbox when close button is clicked', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByRole('button', { name: 'Photo 1' }))
    fireEvent.click(screen.getByRole('button', { name: /close lightbox/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd "/Users/dimeji/docs/Wedding Website"
npx vitest run __tests__/features/gallery/
```

Expected: tests fail (4-tab assertions, old category names)

- [ ] **Step 3: Update `config/content.ts` — gallery image categories**

In `config/content.ts`, find the `GALLERY_IMAGES` block (lines 211–218) and replace it:

```ts
export const GALLERY_IMAGES = [
  { id: 'g1', src: '/images/gallery/[PHOTO_1].jpg', alt: '[PHOTO_1_ALT]', category: 'couple-journey' },
  { id: 'g2', src: '/images/gallery/[PHOTO_2].jpg', alt: '[PHOTO_2_ALT]', category: 'proposal'       },
  { id: 'g3', src: '/images/gallery/[PHOTO_3].jpg', alt: '[PHOTO_3_ALT]', category: 'couple-journey' },
  { id: 'g4', src: '/images/gallery/[PHOTO_4].jpg', alt: '[PHOTO_4_ALT]', category: 'proposal'       },
  { id: 'g5', src: '/images/gallery/[PHOTO_5].jpg', alt: '[PHOTO_5_ALT]', category: 'couple-journey' },
  { id: 'g6', src: '/images/gallery/[PHOTO_6].jpg', alt: '[PHOTO_6_ALT]', category: 'proposal'       },
] as const
```

The two lines immediately after remain unchanged:
```ts
export type GalleryImage    = typeof GALLERY_IMAGES[number]
export type GalleryCategory = 'all' | GalleryImage['category']
```

`GalleryCategory` is now `'all' | 'couple-journey' | 'proposal'` automatically via the derived type.

- [ ] **Step 4: Update `features/gallery/GalleryFilterTabs.tsx`**

Replace the file entirely:

```tsx
'use client'
import type { GalleryCategory } from '@/config/content'

const TABS: { label: string; value: GalleryCategory }[] = [
  { label: 'All',             value: 'all'            },
  { label: 'Couple Journey',  value: 'couple-journey' },
  { label: 'Proposal Photos', value: 'proposal'       },
]

interface GalleryFilterTabsProps {
  active:   GalleryCategory
  onChange: (cat: GalleryCategory) => void
}

export function GalleryFilterTabs({ active, onChange }: GalleryFilterTabsProps) {
  return (
    <div role="tablist" className="flex gap-6 justify-center mb-12 flex-wrap">
      {TABS.map(tab => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => onChange(tab.value)}
          className={`font-sans text-[10px] tracking-[0.18em] uppercase pb-1 transition-colors duration-200 ${
            active === tab.value
              ? 'text-plum border-b border-gold'
              : 'text-plum/40 hover:text-plum/70'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npx vitest run __tests__/features/gallery/
```

Expected: all gallery tests pass

- [ ] **Step 6: Commit**

```bash
git add config/content.ts features/gallery/GalleryFilterTabs.tsx \
  __tests__/features/gallery/GalleryFilterTabs.test.tsx \
  __tests__/features/gallery/GalleryGrid.test.tsx
git commit -m "feat: update gallery to Couple Journey and Proposal Photos categories"
```

---

## Task 2: Rename Guestbook Page to "Ode to the Couple"

**Files:**
- Modify: `config/content.ts` (NAV_LINKS only)
- Modify: `app/guestbook/page.tsx`

- [ ] **Step 1: Update the nav label in `config/content.ts`**

Find this line in the `NAV_LINKS` array (line 183):
```ts
  { label: 'Guestbook',    href: '/guestbook',    gated: false },
```

Replace with:
```ts
  { label: 'Ode to the Couple', href: '/guestbook', gated: false },
```

- [ ] **Step 2: Replace `app/guestbook/page.tsx`**

```tsx
import { GuestbookWall } from '@/features/guestbook/GuestbookWall'

export default function GuestbookPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32">
      <section>
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          Ode to the Couple
        </h1>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          Leave your blessing for us
        </p>
        <GuestbookWall />
      </section>
    </div>
  )
}
```

Note: the `QuizModule` import and its section are intentionally removed — the quiz moves to the floating widget in Task 4.

- [ ] **Step 3: Run the full test suite to confirm nothing broke**

```bash
npx vitest run
```

Expected: all existing tests pass (no test directly asserts the page h1 text)

- [ ] **Step 4: Commit**

```bash
git add config/content.ts app/guestbook/page.tsx
git commit -m "feat: rename guestbook page to Ode to the Couple, remove quiz section"
```

---

## Task 3: Registry Flip Cards

**Files:**
- Modify: `features/registry/RegistrySection.tsx` (full replacement, becomes `'use client'`)
- Modify: `__tests__/features/registry/RegistrySection.test.tsx` (full replacement)

The old `RegistrySection` was a Server Component with no state. The new one needs state for flip and account tab, so it becomes a Client Component. The `app/registry/page.tsx` stays untouched — it imports `RegistrySection` by name, which still exports correctly.

- [ ] **Step 1: Write the failing tests**

Replace `__tests__/features/registry/RegistrySection.test.tsx` entirely:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegistrySection } from '@/features/registry/RegistrySection'

describe('RegistrySection', () => {
  it('renders Give to the Couple card front', () => {
    render(<RegistrySection />)
    expect(screen.getByText(/give to the couple/i)).toBeInTheDocument()
  })

  it('renders Gift List card front', () => {
    render(<RegistrySection />)
    expect(screen.getByText(/gift list/i)).toBeInTheDocument()
  })

  it('renders both account tabs on card 1', () => {
    render(<RegistrySection />)
    expect(screen.getByRole('button', { name: /nigerian/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /intl/i })).toBeInTheDocument()
  })

  it('shows Nigerian account fields by default', () => {
    render(<RegistrySection />)
    expect(screen.getByText('Account No.')).toBeInTheDocument()
    expect(screen.queryByText('IBAN')).not.toBeInTheDocument()
  })

  it('switches to International fields when Intl tab is clicked', () => {
    render(<RegistrySection />)
    fireEvent.click(screen.getByRole('button', { name: /intl/i }))
    expect(screen.getByText('IBAN')).toBeInTheDocument()
    expect(screen.queryByText('Account No.')).not.toBeInTheDocument()
  })

  it('renders Amazon List and Giftwhale links', () => {
    render(<RegistrySection />)
    expect(screen.getByRole('link', { name: /amazon list/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /giftwhale/i })).toBeInTheDocument()
  })

  it('Amazon link opens in new tab', () => {
    render(<RegistrySection />)
    expect(screen.getByRole('link', { name: /amazon list/i })).toHaveAttribute('target', '_blank')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run __tests__/features/registry/RegistrySection.test.tsx
```

Expected: tests fail (old component renders labels/links differently)

- [ ] **Step 3: Replace `features/registry/RegistrySection.tsx`**

```tsx
'use client'
import { useState } from 'react'

type Account = 'ng' | 'intl'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-sans text-[9px] uppercase tracking-[0.12em] text-plum/50 mt-2">{label}</p>
      <p className="font-sans text-[12px] font-semibold text-plum">{value}</p>
    </div>
  )
}

export function RegistrySection() {
  const [card1Flipped, setCard1Flipped] = useState(false)
  const [card2Flipped, setCard2Flipped] = useState(false)
  const [account,      setAccount]      = useState<Account>('ng')

  return (
    <div className="flex gap-8 justify-center flex-wrap py-4">

      {/* Card 1 — Give to the Couple */}
      <div
        className="w-64 h-80 cursor-pointer select-none"
        style={{ perspective: '900px' }}
        onClick={() => setCard1Flipped(f => !f)}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle:  'preserve-3d',
            transition:      'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
            transform:       card1Flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              background:         'linear-gradient(145deg, #5b3d6e 0%, #7a5490 100%)',
            }}
          >
            <svg width="58" height="58" viewBox="0 0 60 60" fill="none" className="mb-4" aria-hidden="true">
              <path d="M30 50 C30 50 8 35 8 20 C8 13 13.5 8 20 8 C24 8 27.5 10.5 30 14 C32.5 10.5 36 8 40 8 C46.5 8 52 13 52 20 C52 35 30 50 30 50Z" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M30 43 C30 43 13 31 13 21 C13 16.5 16.5 13 21 13 C24.5 13 27 15 30 18.5 C33 15 35.5 13 39 13 C43.5 13 47 16.5 47 21 C47 31 30 43 30 43Z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1"/>
              <circle cx="15" cy="14" r="1.5" fill="white" opacity="0.6"/>
              <circle cx="45" cy="12" r="1"   fill="white" opacity="0.5"/>
              <circle cx="48" cy="30" r="1.5" fill="white" opacity="0.4"/>
            </svg>
            <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-white font-bold mb-2">
              Give to the Couple
            </p>
            <p className="font-sans text-[10px] text-white/70 tracking-widest">
              Tap to see account details
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-5 shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform:          'rotateY(180deg)',
              background:         '#fffaf6',
              border:             '1.5px solid #e8ddd5',
            }}
          >
            <p className="font-sans text-[9px] font-bold tracking-[0.14em] uppercase text-plum mb-3">
              Account Details
            </p>

            {/* Tab switcher — stopPropagation so clicks don't flip the card */}
            <div
              className="flex w-full rounded-lg overflow-hidden mb-3"
              style={{ border: '1.5px solid #d8ccc4' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                aria-pressed={account === 'ng'}
                className={`flex-1 py-1.5 font-sans text-[9px] font-bold tracking-widest uppercase transition-colors ${
                  account === 'ng' ? 'bg-plum text-ivory' : 'bg-white text-plum/50'
                }`}
                onClick={e => { e.stopPropagation(); setAccount('ng') }}
              >
                🇳🇬 Nigerian
              </button>
              <button
                aria-pressed={account === 'intl'}
                className={`flex-1 py-1.5 font-sans text-[9px] font-bold tracking-widest uppercase transition-colors border-l ${
                  account === 'intl' ? 'bg-plum text-ivory' : 'bg-white text-plum/50'
                }`}
                style={{ borderLeftColor: '#d8ccc4' }}
                onClick={e => { e.stopPropagation(); setAccount('intl') }}
              >
                🌍 Intl
              </button>
            </div>

            {account === 'ng' ? (
              <div className="w-full">
                <DetailRow label="Account Name" value="Feyisogo & Dimeji" />
                <DetailRow label="Bank"         value="[BANK_NAME]"       />
                <DetailRow label="Account No."  value="[ACCOUNT_NUMBER]"  />
                <DetailRow label="Sort Code"    value="[SORT_CODE]"       />
              </div>
            ) : (
              <div className="w-full">
                <DetailRow label="Account Name" value="Feyisogo & Dimeji" />
                <DetailRow label="IBAN"         value="[IBAN]"            />
                <DetailRow label="BIC / SWIFT"  value="[BIC_SWIFT]"      />
                <DetailRow label="Bank"         value="[BANK_NAME_INTL]"  />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 2 — Gift List */}
      <div
        className="w-64 h-80 cursor-pointer select-none"
        style={{ perspective: '900px' }}
        onClick={() => setCard2Flipped(f => !f)}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition:     'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
            transform:      card2Flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              background:         'linear-gradient(145deg, #9c6b38 0%, #c4904a 100%)',
            }}
          >
            <svg width="58" height="58" viewBox="0 0 60 60" fill="none" className="mb-4" aria-hidden="true">
              <rect x="10" y="26" width="40" height="26" rx="3" fill="rgba(255,255,255,0.2)"  stroke="white" strokeWidth="1.5"/>
              <rect x="8"  y="20" width="44" height="8"  rx="3" fill="rgba(255,255,255,0.3)"  stroke="white" strokeWidth="1.5"/>
              <rect x="27" y="20" width="6"  height="32" rx="1" fill="rgba(255,255,255,0.5)"/>
              <rect x="8"  y="22" width="44" height="4"  rx="1" fill="rgba(255,255,255,0.4)"/>
              <path d="M30 20 C28 14 20 12 20 18 C20 22 28 22 30 20Z" fill="rgba(255,255,255,0.7)" stroke="white" strokeWidth="1"/>
              <path d="M30 20 C32 14 40 12 40 18 C40 22 32 22 30 20Z" fill="rgba(255,255,255,0.7)" stroke="white" strokeWidth="1"/>
              <circle cx="30" cy="20" r="3" fill="white"/>
            </svg>
            <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-white font-bold mb-2">
              Gift List
            </p>
            <p className="font-sans text-[10px] text-white/70 tracking-widest">
              Tap to explore our wishlist
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform:          'rotateY(180deg)',
              background:         '#fffaf6',
              border:             '1.5px solid #e8ddd5',
            }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="mb-3" aria-hidden="true">
              <circle cx="16" cy="22" r="9" stroke="#9c6b38" strokeWidth="2.5" fill="none"/>
              <circle cx="28" cy="22" r="9" stroke="#9c6b38" strokeWidth="2.5" fill="none"/>
              <path d="M22 15 C24.5 17 24.5 27 22 29" stroke="#fffaf6" strokeWidth="3"/>
              <path d="M22 15 C19.5 17 19.5 27 22 29" stroke="#fffaf6" strokeWidth="3"/>
            </svg>
            <p className="font-sans text-[9px] uppercase tracking-[0.12em] text-plum/50 mb-4">
              Browse our wishlist
            </p>
            <a
              href="#"
              onClick={e => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-2 rounded-full bg-plum text-ivory font-sans text-[10px] font-semibold tracking-widest uppercase mb-2 hover:bg-plum/90 transition-colors"
            >
              Amazon List
            </a>
            <a
              href="#"
              onClick={e => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-2 rounded-full text-ivory font-sans text-[10px] font-semibold tracking-widest uppercase hover:opacity-80 transition-opacity"
              style={{ background: '#9c6b38' }}
            >
              Giftwhale
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run __tests__/features/registry/RegistrySection.test.tsx
```

Expected: all 7 tests pass

- [ ] **Step 5: Commit**

```bash
git add features/registry/RegistrySection.tsx \
  __tests__/features/registry/RegistrySection.test.tsx
git commit -m "feat: replace registry list with 3D flip cards (monetary + gift list)"
```

---

## Task 4: Floating Quiz Widget

**Files:**
- Create: `features/quiz-widget/QuizWidgetButton.tsx`
- Create: `__tests__/features/quiz-widget/QuizWidgetButton.test.tsx`
- Modify: `app/layout.tsx`

The widget is a self-contained `'use client'` component. It imports `QuizModule` from its existing location (`features/guestbook/quiz/QuizModule.tsx`) — do not move that file. The component is mounted outside `<LenisProvider>` in layout, matching the existing `<AudioToggle />` pattern.

- [ ] **Step 1: Create the test file first**

Create `__tests__/features/quiz-widget/QuizWidgetButton.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizWidgetButton } from '@/features/quiz-widget/QuizWidgetButton'

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, className, style, role, onClick, 'aria-label': ariaLabel }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} style={style} role={role} onClick={onClick} aria-label={ariaLabel}>{children}</div>,
  },
}))

vi.mock('@/features/guestbook/quiz/QuizModule', () => ({
  QuizModule: () => <div data-testid="quiz-module">Quiz content</div>,
}))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ scores: [] }), { status: 200 }),
  ))
})
afterEach(() => { vi.unstubAllGlobals() })

describe('QuizWidgetButton', () => {
  it('renders the trigger button', () => {
    render(<QuizWidgetButton />)
    expect(screen.getByRole('button', { name: /open quiz/i })).toBeInTheDocument()
  })

  it('drawer is not visible initially', () => {
    render(<QuizWidgetButton />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the drawer when trigger is clicked', () => {
    render(<QuizWidgetButton />)
    fireEvent.click(screen.getByRole('button', { name: /open quiz/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the drawer via the close button', () => {
    render(<QuizWidgetButton />)
    fireEvent.click(screen.getByRole('button', { name: /open quiz/i }))
    fireEvent.click(screen.getByRole('button', { name: /close quiz/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the drawer when backdrop is clicked', () => {
    render(<QuizWidgetButton />)
    fireEvent.click(screen.getByRole('button', { name: /open quiz/i }))
    fireEvent.click(screen.getByLabelText('Close quiz backdrop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the QuizModule inside the open drawer', () => {
    render(<QuizWidgetButton />)
    fireEvent.click(screen.getByRole('button', { name: /open quiz/i }))
    expect(screen.getByTestId('quiz-module')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run __tests__/features/quiz-widget/QuizWidgetButton.test.tsx
```

Expected: FAIL — `QuizWidgetButton` does not exist yet

- [ ] **Step 3: Create `features/quiz-widget/QuizWidgetButton.tsx`**

```tsx
'use client'
import { useState }                        from 'react'
import { AnimatePresence, motion }          from 'framer-motion'
import { QuizModule }                       from '@/features/guestbook/quiz/QuizModule'

export function QuizWidgetButton() {
  const [open, setOpen] = useState(false)

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
              aria-label="How Well Do You Know Us?"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-ivory rounded-t-2xl overflow-y-auto"
              style={{ maxHeight: '70vh' }}
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

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run __tests__/features/quiz-widget/QuizWidgetButton.test.tsx
```

Expected: all 6 tests pass

- [ ] **Step 5: Mount the widget in `app/layout.tsx`**

Add the import after the existing `AudioToggle` import:

```tsx
import { AudioToggle }     from '@/components/ui/AudioToggle'
import { QuizWidgetButton } from '@/features/quiz-widget/QuizWidgetButton'
```

Add `<QuizWidgetButton />` immediately after `<AudioToggle />` in the `<body>`:

```tsx
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
        <QuizWidgetButton />
      </body>
```

- [ ] **Step 6: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add features/quiz-widget/QuizWidgetButton.tsx \
  __tests__/features/quiz-widget/QuizWidgetButton.test.tsx \
  app/layout.tsx
git commit -m "feat: add floating quiz widget (bottom-left trophy button, slide-up drawer)"
```

---

## Done

All four changes are complete. The full test suite should be green. Invoke `superpowers:finishing-a-development-branch` if you need PR prep.
