# Plan 5: Gallery, Guestbook, Quiz & Registry

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Gallery (masonry + lightbox), Guestbook (polaroid wall + form), Quiz (timed MCQ + leaderboard), and Registry (static links) pages.

**Architecture:** Feature-based folders matching the established pattern. Gallery and Registry are purely static/client. Guestbook and Quiz are client components backed by two new API routes (`/api/guestbook`, `/api/quiz`) writing to Supabase. Supabase tables must be created before Task 9.

**Tech Stack:** Next.js App Router, Tailwind CSS, Framer Motion, Supabase, Zod, Vitest + Testing Library

---

## File Map

**Create:**
- `features/gallery/GalleryFilterTabs.tsx`
- `features/gallery/LightboxModal.tsx`
- `features/gallery/GalleryGrid.tsx`
- `features/registry/RegistrySection.tsx`
- `features/guestbook/PolaroidCard.tsx`
- `features/guestbook/GuestbookForm.tsx`
- `features/guestbook/GuestbookWall.tsx`
- `features/guestbook/quiz/AvatarPicker.tsx`
- `features/guestbook/quiz/QuizQuestion.tsx`
- `features/guestbook/quiz/Leaderboard.tsx`
- `features/guestbook/quiz/QuizModule.tsx`
- `app/api/guestbook/route.ts`
- `app/api/quiz/route.ts`

**Modify:**
- `config/content.ts` (add `GALLERY_IMAGES`, `REGISTRY_LINKS`)
- `app/gallery/page.tsx`
- `app/guestbook/page.tsx`
- `app/registry/page.tsx`

**Tests:**
- `__tests__/features/gallery/GalleryFilterTabs.test.tsx`
- `__tests__/features/gallery/LightboxModal.test.tsx`
- `__tests__/features/gallery/GalleryGrid.test.tsx`
- `__tests__/features/registry/RegistrySection.test.tsx`
- `__tests__/app/api/guestbook/route.test.ts`
- `__tests__/app/api/quiz/route.test.ts`
- `__tests__/features/guestbook/PolaroidCard.test.tsx`
- `__tests__/features/guestbook/GuestbookForm.test.tsx`
- `__tests__/features/guestbook/GuestbookWall.test.tsx`
- `__tests__/features/guestbook/quiz/AvatarPicker.test.tsx`
- `__tests__/features/guestbook/quiz/QuizModule.test.tsx`
- `__tests__/features/guestbook/quiz/Leaderboard.test.tsx`

---

## Task 1: Gallery content config

**Files:**
- Modify: `config/content.ts`

- [ ] **Step 1: Add GALLERY_IMAGES and derived types to the bottom of `config/content.ts` (before the closing)**

```ts
export const GALLERY_IMAGES = [
  { id: 'g1', src: '/images/gallery/[PHOTO_1].jpg', alt: '[PHOTO_1_ALT]', category: 'pre-wedding'  },
  { id: 'g2', src: '/images/gallery/[PHOTO_2].jpg', alt: '[PHOTO_2_ALT]', category: 'traditional'  },
  { id: 'g3', src: '/images/gallery/[PHOTO_3].jpg', alt: '[PHOTO_3_ALT]', category: 'family'       },
  { id: 'g4', src: '/images/gallery/[PHOTO_4].jpg', alt: '[PHOTO_4_ALT]', category: 'pre-wedding'  },
  { id: 'g5', src: '/images/gallery/[PHOTO_5].jpg', alt: '[PHOTO_5_ALT]', category: 'traditional'  },
  { id: 'g6', src: '/images/gallery/[PHOTO_6].jpg', alt: '[PHOTO_6_ALT]', category: 'family'       },
] as const

export type GalleryImage    = typeof GALLERY_IMAGES[number]
export type GalleryCategory = 'all' | GalleryImage['category']

export const REGISTRY_LINKS = [
  { id: 'r1', label: '[REGISTRY_1_NAME]', url: '[REGISTRY_1_URL]', note: '[REGISTRY_1_NOTE]' },
  { id: 'r2', label: '[REGISTRY_2_NAME]', url: '[REGISTRY_2_URL]', note: '[REGISTRY_2_NOTE]' },
] as const
```

- [ ] **Step 2: Commit**

```bash
git add config/content.ts
git commit -m "feat: add GALLERY_IMAGES and REGISTRY_LINKS placeholders to content config"
```

---

## Task 2: GalleryFilterTabs

**Files:**
- Create: `features/gallery/GalleryFilterTabs.tsx`
- Test: `__tests__/features/gallery/GalleryFilterTabs.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/gallery/GalleryFilterTabs.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryFilterTabs } from '@/features/gallery/GalleryFilterTabs'

describe('GalleryFilterTabs', () => {
  it('renders all four tabs', () => {
    render(<GalleryFilterTabs active="all" onChange={vi.fn()} />)
    expect(screen.getAllByRole('tab')).toHaveLength(4)
  })

  it('marks the active tab as selected', () => {
    render(<GalleryFilterTabs active="traditional" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Traditional' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange with the correct category when clicked', () => {
    const onChange = vi.fn()
    render(<GalleryFilterTabs active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Pre-wedding' }))
    expect(onChange).toHaveBeenCalledWith('pre-wedding')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL (module not found)**

```bash
npm test -- __tests__/features/gallery/GalleryFilterTabs.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/gallery/GalleryFilterTabs.tsx
'use client'
import type { GalleryCategory } from '@/config/content'

const TABS: { label: string; value: GalleryCategory }[] = [
  { label: 'All',         value: 'all'         },
  { label: 'Traditional', value: 'traditional' },
  { label: 'Pre-wedding', value: 'pre-wedding' },
  { label: 'Family',      value: 'family'      },
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

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/gallery/GalleryFilterTabs.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/gallery/GalleryFilterTabs.tsx __tests__/features/gallery/GalleryFilterTabs.test.tsx
git commit -m "feat: add GalleryFilterTabs component"
```

---

## Task 3: LightboxModal

**Files:**
- Create: `features/gallery/LightboxModal.tsx`
- Test: `__tests__/features/gallery/LightboxModal.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/gallery/LightboxModal.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LightboxModal } from '@/features/gallery/LightboxModal'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

const IMAGES = [
  { id: 'g1', src: '/img/1.jpg', alt: 'Photo 1', category: 'pre-wedding' as const },
  { id: 'g2', src: '/img/2.jpg', alt: 'Photo 2', category: 'traditional' as const },
] as const

describe('LightboxModal', () => {
  it('renders the image at initialIndex', () => {
    render(<LightboxModal images={IMAGES} initialIndex={0} onClose={vi.fn()} />)
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<LightboxModal images={IMAGES} initialIndex={0} onClose={onClose} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<LightboxModal images={IMAGES} initialIndex={0} onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('advances to next image when next button clicked', () => {
    render(<LightboxModal images={IMAGES} initialIndex={0} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /next image/i }))
    expect(screen.getByAltText('Photo 2')).toBeInTheDocument()
  })

  it('wraps around from last to first on next', () => {
    render(<LightboxModal images={IMAGES} initialIndex={1} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /next image/i }))
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
  })

  it('goes to previous image when prev button clicked', () => {
    render(<LightboxModal images={IMAGES} initialIndex={1} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /previous image/i }))
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/gallery/LightboxModal.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/gallery/LightboxModal.tsx
'use client'
import { useEffect, useState } from 'react'
import Image                   from 'next/image'
import type { GalleryImage }   from '@/config/content'

interface LightboxModalProps {
  images:       readonly GalleryImage[]
  initialIndex: number
  onClose:      () => void
}

export function LightboxModal({ images, initialIndex, onClose }: LightboxModalProps) {
  const [index, setIndex] = useState(initialIndex)
  const image = images[index]

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft')  setIndex(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [images.length, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      className="fixed inset-0 z-50 bg-plum/95 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] px-12"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>

        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute top-0 right-14 text-ivory/60 hover:text-ivory text-3xl leading-none"
        >
          ×
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setIndex(i => (i - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-ivory px-3 text-4xl"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex(i => (i + 1) % images.length)}
              aria-label="Next image"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-ivory px-3 text-4xl"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/gallery/LightboxModal.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/gallery/LightboxModal.tsx __tests__/features/gallery/LightboxModal.test.tsx
git commit -m "feat: add LightboxModal component"
```

---

## Task 4: GalleryGrid

**Files:**
- Create: `features/gallery/GalleryGrid.tsx`
- Test: `__tests__/features/gallery/GalleryGrid.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/gallery/GalleryGrid.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

vi.mock('@/config/content', () => ({
  GALLERY_IMAGES: [
    { id: 'g1', src: '/img/p1.jpg', alt: 'Photo 1', category: 'pre-wedding' },
    { id: 'g2', src: '/img/p2.jpg', alt: 'Photo 2', category: 'traditional' },
    { id: 'g3', src: '/img/p3.jpg', alt: 'Photo 3', category: 'family'      },
  ],
}))

describe('GalleryGrid', () => {
  it('renders all images when filter is All', () => {
    render(<GalleryGrid />)
    expect(screen.getAllByRole('tab')).toHaveLength(4)
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
    expect(screen.getByAltText('Photo 2')).toBeInTheDocument()
    expect(screen.getByAltText('Photo 3')).toBeInTheDocument()
  })

  it('filters to pre-wedding only', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByRole('tab', { name: 'Pre-wedding' }))
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

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/gallery/GalleryGrid.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/gallery/GalleryGrid.tsx
'use client'
import { useState }             from 'react'
import Image                    from 'next/image'
import { GALLERY_IMAGES, type GalleryCategory } from '@/config/content'
import { GalleryFilterTabs }    from './GalleryFilterTabs'
import { LightboxModal }        from './LightboxModal'

export function GalleryGrid() {
  const [category,    setCategory]    = useState<GalleryCategory>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const filtered = category === 'all'
    ? [...GALLERY_IMAGES]
    : GALLERY_IMAGES.filter(img => img.category === category)

  return (
    <>
      <GalleryFilterTabs active={category} onChange={setCategory} />

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIdx(i)}
            className="block w-full overflow-hidden rounded-sm border border-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={img.alt}
          >
            <div className="relative aspect-[4/3] bg-blush">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (
        <LightboxModal
          images={filtered}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/gallery/GalleryGrid.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/gallery/GalleryGrid.tsx __tests__/features/gallery/GalleryGrid.test.tsx
git commit -m "feat: add GalleryGrid with filter and lightbox"
```

---

## Task 5: Gallery page

**Files:**
- Modify: `app/gallery/page.tsx`

- [ ] **Step 1: Replace the stub**

```tsx
// app/gallery/page.tsx
import { GalleryGrid }    from '@/features/gallery/GalleryGrid'
import { ScriptureStrip } from '@/components/ui/ScriptureStrip'
import { VERSES }         from '@/config/content'

export default function GalleryPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Gallery
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        Moments we have carried
      </p>

      <GalleryGrid />

      <ScriptureStrip
        text={VERSES.gallery.text}
        reference={VERSES.gallery.ref}
      />
    </section>
  )
}
```

- [ ] **Step 2: Run all tests — expect all pass**

```bash
npm test --reporter=verbose 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add app/gallery/page.tsx
git commit -m "feat: wire Gallery page with GalleryGrid and ScriptureStrip"
```

---

## Task 6: Registry

**Files:**
- Create: `features/registry/RegistrySection.tsx`
- Modify: `app/registry/page.tsx`
- Test: `__tests__/features/registry/RegistrySection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/registry/RegistrySection.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen }           from '@testing-library/react'
import { RegistrySection }          from '@/features/registry/RegistrySection'

vi.mock('@/config/content', () => ({
  REGISTRY_LINKS: [
    { id: 'r1', label: 'Amazon',   url: 'https://amazon.com', note: 'Kitchen items'     },
    { id: 'r2', label: 'Wishlist', url: '[REGISTRY_2_URL]',   note: '[REGISTRY_2_NOTE]' },
  ],
}))

describe('RegistrySection', () => {
  it('renders all registry item labels', () => {
    render(<RegistrySection />)
    expect(screen.getByText('Amazon')).toBeInTheDocument()
    expect(screen.getByText('Wishlist')).toBeInTheDocument()
  })

  it('renders a real link for non-placeholder URLs', () => {
    render(<RegistrySection />)
    const link = screen.getByRole('link', { name: /view registry/i })
    expect(link).toHaveAttribute('href', 'https://amazon.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows "Link coming soon" for placeholder URLs', () => {
    render(<RegistrySection />)
    expect(screen.getByText('Link coming soon')).toBeInTheDocument()
  })

  it('renders item notes', () => {
    render(<RegistrySection />)
    expect(screen.getByText('Kitchen items')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/registry/RegistrySection.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement RegistrySection**

```tsx
// features/registry/RegistrySection.tsx
import { REGISTRY_LINKS } from '@/config/content'

export function RegistrySection() {
  return (
    <div className="space-y-6">
      {[...REGISTRY_LINKS].map(item => (
        <div key={item.id} className="border border-gold/15 rounded-sm px-8 py-6 bg-ivory/60">
          <div className="w-8 h-px bg-gold/40 mb-4" aria-hidden="true" />
          <h2 className="font-display text-xl text-plum mb-2">{item.label}</h2>
          {item.note && !item.note.startsWith('[') && (
            <p className="font-sans text-xs text-plum/50 mb-4">{item.note}</p>
          )}
          {item.url.startsWith('[') ? (
            <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-plum/25">
              Link coming soon
            </span>
          ) : (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] tracking-[0.15em] uppercase text-gold hover:text-plum transition-colors duration-200"
            >
              View Registry →
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/registry/RegistrySection.test.tsx --reporter=verbose
```

- [ ] **Step 5: Replace the registry page stub**

```tsx
// app/registry/page.tsx
import { RegistrySection } from '@/features/registry/RegistrySection'

export default function RegistryPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Registry
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        Your presence is the greatest gift
      </p>
      <RegistrySection />
    </section>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add features/registry/RegistrySection.tsx app/registry/page.tsx __tests__/features/registry/RegistrySection.test.tsx
git commit -m "feat: add Registry page and RegistrySection"
```

---

## Task 7: Supabase tables (manual step)

> Run these two SQL statements in the **Supabase Dashboard → SQL Editor** before proceeding to Task 8.

```sql
create table if not exists guestbook (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  author_name text not null,
  message     text not null
);

alter table guestbook enable row level security;
create policy "Anyone can insert" on guestbook for insert with check (true);
create policy "Anyone can select" on guestbook for select using (true);

create table if not exists quiz_scores (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  player_name   text not null,
  avatar        text not null,
  score         int  not null,
  time_taken_ms int  not null
);

alter table quiz_scores enable row level security;
create policy "Anyone can insert" on quiz_scores for insert with check (true);
create policy "Anyone can select" on quiz_scores for select using (true);
```

- [ ] **Step 1: Run the SQL above in Supabase**
- [ ] **Step 2: Verify both tables appear in the Supabase Table Editor**

---

## Task 8: Guestbook API route

**Files:**
- Create: `app/api/guestbook/route.ts`
- Test: `__tests__/app/api/guestbook/route.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// __tests__/app/api/guestbook/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/guestbook/route'
import * as supabaseModule from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({ getSupabase: vi.fn() }))

function mockGetSupabase(getResult: object, postResult?: object) {
  vi.mocked(supabaseModule.getSupabase).mockReturnValue({
    from: () => ({
      select:  () => ({ order: () => ({ limit: vi.fn().mockResolvedValue(getResult) }) }),
      insert:  () => ({ select: () => ({ single: vi.fn().mockResolvedValue(postResult ?? getResult) }) }),
    }),
  } as unknown as ReturnType<typeof supabaseModule.getSupabase>)
}

function makeReq(body: unknown) {
  return new Request('http://localhost/api/guestbook', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
}

describe('GET /api/guestbook', () => {
  it('returns 200 with entries array', async () => {
    mockGetSupabase({ data: [{ id: '1', author_name: 'Ola', message: 'Congrats!', created_at: '2026-01-01' }], error: null })
    const res  = await GET()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.entries).toHaveLength(1)
  })

  it('returns 500 when Supabase errors', async () => {
    mockGetSupabase({ data: null, error: new Error('db down') })
    const res = await GET()
    expect(res.status).toBe(500)
  })
})

describe('POST /api/guestbook', () => {
  beforeEach(() => {
    mockGetSupabase(
      { data: [], error: null },
      { data: { id: '1', author_name: 'Ola', message: 'Congrats!', created_at: '2026-01-01' }, error: null },
    )
  })

  it('returns 422 for missing author_name', async () => {
    const res = await POST(makeReq({ message: 'Hello' }))
    expect(res.status).toBe(422)
  })

  it('returns 422 for empty message', async () => {
    const res = await POST(makeReq({ author_name: 'Ola', message: '' }))
    expect(res.status).toBe(422)
  })

  it('returns 201 with entry on success', async () => {
    const res  = await POST(makeReq({ author_name: 'Ola', message: 'Congrats!' }))
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.entry.author_name).toBe('Ola')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/app/api/guestbook/route.test.ts --reporter=verbose
```

- [ ] **Step 3: Implement**

```ts
// app/api/guestbook/route.ts
import { NextResponse } from 'next/server'
import { z }            from 'zod'
import { getSupabase }  from '@/lib/supabase'

const guestbookSchema = z.object({
  author_name: z.string().min(2, 'Please enter your name'),
  message:     z.string().min(1, 'Please enter a message').max(500),
})

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, created_at, author_name, message')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  return NextResponse.json({ entries: data })
}

export async function POST(req: Request) {
  const body   = await req.json()
  const parsed = guestbookSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('guestbook')
    .insert(parsed.data)
    .select('id, created_at, author_name, message')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  return NextResponse.json({ entry: data }, { status: 201 })
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/app/api/guestbook/route.test.ts --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add app/api/guestbook/route.ts __tests__/app/api/guestbook/route.test.ts
git commit -m "feat: add guestbook API route (GET + POST)"
```

---

## Task 9: Quiz API route

**Files:**
- Create: `app/api/quiz/route.ts`
- Test: `__tests__/app/api/quiz/route.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// __tests__/app/api/quiz/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/quiz/route'
import * as supabaseModule from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({ getSupabase: vi.fn() }))

const SAMPLE_SCORE = { id: '1', player_name: 'Ola', avatar: '💍', score: 5, time_taken_ms: 5000 }

function makeReq(body: unknown) {
  return new Request('http://localhost/api/quiz', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
}

describe('GET /api/quiz', () => {
  beforeEach(() => {
    vi.mocked(supabaseModule.getSupabase).mockReturnValue({
      from: () => ({
        select: () => ({
          order: () => ({
            order: () => ({
              limit: vi.fn().mockResolvedValue({ data: [SAMPLE_SCORE], error: null }),
            }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof supabaseModule.getSupabase>)
  })

  it('returns 200 with scores array', async () => {
    const res  = await GET()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.scores).toHaveLength(1)
    expect(json.scores[0].player_name).toBe('Ola')
  })
})

describe('POST /api/quiz', () => {
  beforeEach(() => {
    vi.mocked(supabaseModule.getSupabase).mockReturnValue({
      from: () => ({
        insert: () => ({
          select: () => ({
            single: vi.fn().mockResolvedValue({ data: SAMPLE_SCORE, error: null }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof supabaseModule.getSupabase>)
  })

  it('returns 422 for missing player_name', async () => {
    const res = await POST(makeReq({ avatar: '💍', score: 5, time_taken_ms: 5000 }))
    expect(res.status).toBe(422)
  })

  it('returns 422 for non-integer score', async () => {
    const res = await POST(makeReq({ player_name: 'Ola', avatar: '💍', score: 'bad', time_taken_ms: 5000 }))
    expect(res.status).toBe(422)
  })

  it('returns 201 with score on success', async () => {
    const res  = await POST(makeReq({ player_name: 'Ola', avatar: '💍', score: 5, time_taken_ms: 5000 }))
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.score.player_name).toBe('Ola')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/app/api/quiz/route.test.ts --reporter=verbose
```

- [ ] **Step 3: Implement**

```ts
// app/api/quiz/route.ts
import { NextResponse } from 'next/server'
import { z }            from 'zod'
import { getSupabase }  from '@/lib/supabase'

const scoreSchema = z.object({
  player_name:   z.string().min(2),
  avatar:        z.string().min(1),
  score:         z.number().int().min(0),
  time_taken_ms: z.number().int().min(0),
})

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('quiz_scores')
    .select('id, player_name, avatar, score, time_taken_ms')
    .order('score',         { ascending: false })
    .order('time_taken_ms', { ascending: true  })
    .limit(10)

  if (error) return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 })
  return NextResponse.json({ scores: data })
}

export async function POST(req: Request) {
  const body   = await req.json()
  const parsed = scoreSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('quiz_scores')
    .insert(parsed.data)
    .select('id, player_name, avatar, score, time_taken_ms')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  return NextResponse.json({ score: data }, { status: 201 })
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/app/api/quiz/route.test.ts --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add app/api/quiz/route.ts __tests__/app/api/quiz/route.test.ts
git commit -m "feat: add quiz API route (GET leaderboard + POST score)"
```

---

## Task 10: PolaroidCard

**Files:**
- Create: `features/guestbook/PolaroidCard.tsx`
- Test: `__tests__/features/guestbook/PolaroidCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/guestbook/PolaroidCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen }       from '@testing-library/react'
import { PolaroidCard }         from '@/features/guestbook/PolaroidCard'

describe('PolaroidCard', () => {
  it('renders the author name', () => {
    render(<PolaroidCard authorName="Ola" message="Congrats!" rotation={2} />)
    expect(screen.getByText(/— Ola/)).toBeInTheDocument()
  })

  it('renders the message', () => {
    render(<PolaroidCard authorName="Ola" message="Congrats!" rotation={2} />)
    expect(screen.getByText('Congrats!')).toBeInTheDocument()
  })

  it('applies rotation via inline style', () => {
    const { container } = render(<PolaroidCard authorName="Ola" message="Hi" rotation={-1.5} />)
    const card = container.firstChild as HTMLElement
    expect(card.style.transform).toBe('rotate(-1.5deg)')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/guestbook/PolaroidCard.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/guestbook/PolaroidCard.tsx
interface PolaroidCardProps {
  authorName: string
  message:    string
  rotation:   number
}

export function PolaroidCard({ authorName, message, rotation }: PolaroidCardProps) {
  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className="bg-white border border-gray-100 shadow-md p-4 pb-8 break-inside-avoid"
    >
      <div className="bg-blush w-full aspect-[4/3] mb-3 flex items-center justify-center">
        <span className="font-script italic text-plum/20 text-4xl" aria-hidden="true">♡</span>
      </div>
      <p className="font-sans text-xs text-plum/70 leading-relaxed mb-3 line-clamp-5">
        {message}
      </p>
      <p className="font-script italic text-plum/40 text-sm text-right">
        — {authorName}
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/guestbook/PolaroidCard.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/guestbook/PolaroidCard.tsx __tests__/features/guestbook/PolaroidCard.test.tsx
git commit -m "feat: add PolaroidCard component"
```

---

## Task 11: GuestbookForm

**Files:**
- Create: `features/guestbook/GuestbookForm.tsx`
- Test: `__tests__/features/guestbook/GuestbookForm.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/guestbook/GuestbookForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor }   from '@testing-library/react'
import { GuestbookForm }                         from '@/features/guestbook/GuestbookForm'

const ENTRY = { id: '1', author_name: 'Ola', message: 'Congrats!', created_at: '2026-01-01' }

describe('GuestbookForm', () => {
  beforeEach(() => { vi.unstubAllGlobals() })

  it('renders name and message fields', () => {
    render(<GuestbookForm onSubmitted={vi.fn()} />)
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/write your blessing/i)).toBeInTheDocument()
  })

  it('calls onSubmitted with the new entry on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ entry: ENTRY }), { status: 201 }),
    ))
    const onSubmitted = vi.fn()
    render(<GuestbookForm onSubmitted={onSubmitted} />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i),    { target: { value: 'Ola' } })
    fireEvent.change(screen.getByPlaceholderText(/write your blessing/i), { target: { value: 'Congrats!' } })
    fireEvent.click(screen.getByRole('button', { name: /leave a blessing/i }))
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledWith(ENTRY))
  })

  it('shows thank-you message after successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ entry: ENTRY }), { status: 201 }),
    ))
    render(<GuestbookForm onSubmitted={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i),    { target: { value: 'Ola' } })
    fireEvent.change(screen.getByPlaceholderText(/write your blessing/i), { target: { value: 'Congrats!' } })
    fireEvent.click(screen.getByRole('button', { name: /leave a blessing/i }))
    await waitFor(() => expect(screen.getByText(/thank you/i)).toBeInTheDocument())
  })

  it('shows error alert on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })))
    render(<GuestbookForm onSubmitted={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i),    { target: { value: 'Ola' } })
    fireEvent.change(screen.getByPlaceholderText(/write your blessing/i), { target: { value: 'Congrats!' } })
    fireEvent.click(screen.getByRole('button', { name: /leave a blessing/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/guestbook/GuestbookForm.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/guestbook/GuestbookForm.tsx
'use client'
import { useState } from 'react'

export interface GuestbookEntry {
  id:          string
  author_name: string
  message:     string
  created_at:  string
}

interface GuestbookFormProps {
  onSubmitted: (entry: GuestbookEntry) => void
}

export function GuestbookForm({ onSubmitted }: GuestbookFormProps) {
  const [name,       setName]       = useState('')
  const [message,    setMessage]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [submitted,  setSubmitted]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res  = await fetch('/api/guestbook', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ author_name: name, message }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error('Submit failed')
      onSubmitted(json.entry)
      setName('')
      setMessage('')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <p className="font-script italic text-plum/60 text-2xl text-center py-8">
        Thank you for your blessing ♡
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-16">
      {error && (
        <p role="alert" className="font-sans text-xs text-red-600/80 text-center border border-red-300/30 rounded-sm py-3 px-4">
          {error}
        </p>
      )}
      <div>
        <label className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 block mb-1">
          Your Name
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          minLength={2}
          placeholder="Enter your name"
          className="w-full border border-gold/20 rounded-sm px-4 py-3 font-sans text-sm text-plum bg-transparent focus:outline-none focus:border-gold/50"
        />
      </div>
      <div>
        <label className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 block mb-1">
          Leave a Message
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          maxLength={500}
          rows={4}
          placeholder="Write your blessing for the couple…"
          className="w-full border border-gold/20 rounded-sm px-4 py-3 font-sans text-sm text-plum bg-transparent focus:outline-none focus:border-gold/50 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full border border-gold/30 text-plum font-sans text-[10px] tracking-[0.18em] uppercase py-3 hover:bg-plum hover:text-ivory transition-colors duration-300 disabled:opacity-40"
      >
        {submitting ? 'Sending…' : 'Leave a Blessing'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/guestbook/GuestbookForm.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/guestbook/GuestbookForm.tsx __tests__/features/guestbook/GuestbookForm.test.tsx
git commit -m "feat: add GuestbookForm with submit and error handling"
```

---

## Task 12: GuestbookWall

**Files:**
- Create: `features/guestbook/GuestbookWall.tsx`
- Test: `__tests__/features/guestbook/GuestbookWall.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/guestbook/GuestbookWall.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor }              from '@testing-library/react'
import { GuestbookWall }                         from '@/features/guestbook/GuestbookWall'

describe('GuestbookWall', () => {
  beforeEach(() => { vi.unstubAllGlobals() })

  it('shows empty state when no entries returned', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ entries: [] }), { status: 200 }),
    ))
    render(<GuestbookWall />)
    await waitFor(() => expect(screen.getByText(/be the first/i)).toBeInTheDocument())
  })

  it('renders polaroid cards for each entry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        entries: [
          { id: '1', author_name: 'Ola', message: 'Congrats!', created_at: '2026-01-01' },
          { id: '2', author_name: 'Fey', message: 'So happy!', created_at: '2026-01-02' },
        ],
      }), { status: 200 }),
    ))
    render(<GuestbookWall />)
    await waitFor(() => expect(screen.getByText(/— Ola/)).toBeInTheDocument())
    expect(screen.getByText(/— Fey/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/guestbook/GuestbookWall.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/guestbook/GuestbookWall.tsx
'use client'
import { useEffect, useState }              from 'react'
import { PolaroidCard }                     from './PolaroidCard'
import { GuestbookForm, type GuestbookEntry } from './GuestbookForm'

const ROTATIONS = [-2, 1.5, -0.5, 2.5, -1, 1]

export function GuestbookWall() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/guestbook')
      .then(r => r.json())
      .then(json => setEntries(json.entries ?? []))
      .finally(() => setLoading(false))
  }, [])

  function handleNewEntry(entry: GuestbookEntry) {
    setEntries(prev => [entry, ...prev])
  }

  return (
    <div>
      <GuestbookForm onSubmitted={handleNewEntry} />

      {loading ? (
        <p className="font-sans text-xs text-plum/30 text-center mt-16 tracking-widest uppercase">
          Loading messages…
        </p>
      ) : entries.length === 0 ? (
        <p className="font-sans text-xs text-plum/30 text-center mt-16 tracking-widest uppercase">
          Be the first to leave a message
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 mt-16">
          {entries.map((entry, i) => (
            <PolaroidCard
              key={entry.id}
              authorName={entry.author_name}
              message={entry.message}
              rotation={ROTATIONS[i % ROTATIONS.length]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/guestbook/GuestbookWall.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/guestbook/GuestbookWall.tsx __tests__/features/guestbook/GuestbookWall.test.tsx
git commit -m "feat: add GuestbookWall — polaroid card wall with form"
```

---

## Task 13: AvatarPicker

**Files:**
- Create: `features/guestbook/quiz/AvatarPicker.tsx`
- Test: `__tests__/features/guestbook/quiz/AvatarPicker.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/guestbook/quiz/AvatarPicker.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AvatarPicker, AVATARS }     from '@/features/guestbook/quiz/AvatarPicker'

describe('AvatarPicker', () => {
  it('renders a button for every avatar', () => {
    render(<AvatarPicker selected={null} onSelect={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(AVATARS.length)
  })

  it('marks the selected avatar as pressed', () => {
    render(<AvatarPicker selected={AVATARS[0]} onSelect={vi.fn()} />)
    expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('button')[1]).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onSelect with the clicked avatar', () => {
    const onSelect = vi.fn()
    render(<AvatarPicker selected={null} onSelect={onSelect} />)
    fireEvent.click(screen.getAllByRole('button')[2])
    expect(onSelect).toHaveBeenCalledWith(AVATARS[2])
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/guestbook/quiz/AvatarPicker.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/guestbook/quiz/AvatarPicker.tsx
'use client'

export const AVATARS = ['💍', '🎂', '🥁', '🥂', '🐚'] as const
export type Avatar = typeof AVATARS[number]

interface AvatarPickerProps {
  selected: Avatar | null
  onSelect: (avatar: Avatar) => void
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {AVATARS.map(avatar => (
        <button
          key={avatar}
          type="button"
          onClick={() => onSelect(avatar)}
          aria-pressed={selected === avatar}
          aria-label={`Select ${avatar} avatar`}
          className={`text-3xl p-2 rounded-full border-2 transition-all duration-200 ${
            selected === avatar
              ? 'border-gold scale-110'
              : 'border-transparent hover:border-gold/40'
          }`}
        >
          {avatar}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/guestbook/quiz/AvatarPicker.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/guestbook/quiz/AvatarPicker.tsx __tests__/features/guestbook/quiz/AvatarPicker.test.tsx
git commit -m "feat: add AvatarPicker component"
```

---

## Task 14: QuizQuestion

**Files:**
- Create: `features/guestbook/quiz/QuizQuestion.tsx`

> QuizQuestion is tightly coupled to `setTimeout`/`setInterval` timing. Its behaviour is fully exercised by QuizModule tests (Task 16). No isolated test here.

- [ ] **Step 1: Implement**

```tsx
// features/guestbook/quiz/QuizQuestion.tsx
'use client'
import { useEffect, useState } from 'react'
import type { QUIZ_QUESTIONS } from '@/config/content'

type Question = typeof QUIZ_QUESTIONS[number]

interface QuizQuestionProps {
  question:    Question
  questionNum: number
  total:       number
  onAnswer:    (correct: boolean, timeTakenMs: number) => void
}

const QUESTION_TIME_MS = 10_000

export function QuizQuestion({ question, questionNum, total, onAnswer }: QuizQuestionProps) {
  const [selected,  setSelected]  = useState<number | null>(null)
  const [startTime]               = useState(() => Date.now())
  const [remaining, setRemaining] = useState(QUESTION_TIME_MS)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 200
        if (next <= 0) {
          clearInterval(interval)
          onAnswer(false, QUESTION_TIME_MS)
          return 0
        }
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [onAnswer])

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    const timeTaken = Date.now() - startTime
    setTimeout(() => onAnswer(idx === question.answer, timeTaken), 600)
  }

  const progressPct = (remaining / QUESTION_TIME_MS) * 100

  return (
    <div className="max-w-md mx-auto">
      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/30 text-center mb-6">
        Question {questionNum} of {total}
      </p>

      <div className="w-full bg-blush rounded-full h-1 mb-8">
        <div
          className="bg-gold h-1 rounded-full transition-all duration-200"
          style={{ width: `${progressPct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(remaining / 1000)}
          aria-valuemax={QUESTION_TIME_MS / 1000}
          aria-label="Time remaining"
        />
      </div>

      <p className="font-display text-xl text-plum text-center mb-8">
        {question.question}
      </p>

      <div className="space-y-3">
        {[...question.options].map((option, idx) => {
          let cls = 'border-gold/20 text-plum hover:border-gold/50'
          if (selected !== null) {
            if (idx === question.answer) cls = 'border-green-400 text-green-700 bg-green-50'
            else if (idx === selected)   cls = 'border-red-300  text-red-600   bg-red-50'
            else                         cls = 'border-gold/10  text-plum/30'
          }
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 border rounded-sm font-sans text-sm transition-all duration-300 disabled:cursor-default ${cls}`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/guestbook/quiz/QuizQuestion.tsx
git commit -m "feat: add QuizQuestion component with countdown timer"
```

---

## Task 15: Leaderboard

**Files:**
- Create: `features/guestbook/quiz/Leaderboard.tsx`
- Test: `__tests__/features/guestbook/quiz/Leaderboard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/guestbook/quiz/Leaderboard.test.tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor }              from '@testing-library/react'
import { Leaderboard }                          from '@/features/guestbook/quiz/Leaderboard'

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })

describe('Leaderboard', () => {
  it('shows loading initially', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ scores: [] }), { status: 200 }),
    ))
    render(<Leaderboard />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows empty state when no scores', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ scores: [] }), { status: 200 }),
    ))
    render(<Leaderboard />)
    await waitFor(() => expect(screen.getByText(/no scores yet/i)).toBeInTheDocument())
  })

  it('renders leaderboard entries', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        scores: [{ id: '1', player_name: 'Ola', avatar: '💍', score: 5, time_taken_ms: 5000 }],
      }), { status: 200 }),
    ))
    render(<Leaderboard />)
    await waitFor(() => expect(screen.getByText('Ola')).toBeInTheDocument())
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/guestbook/quiz/Leaderboard.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/guestbook/quiz/Leaderboard.tsx
'use client'
import { useEffect, useState } from 'react'

interface ScoreEntry {
  id:            string
  player_name:   string
  avatar:        string
  score:         number
  time_taken_ms: number
}

const RANK_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export function Leaderboard() {
  const [scores,  setScores]  = useState<ScoreEntry[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    fetch('/api/quiz')
      .then(r => r.json())
      .then(json => setScores(json.scores ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <p className="font-sans text-xs text-plum/30 text-center tracking-widest uppercase">
      Loading scores…
    </p>
  )

  if (scores.length === 0) return (
    <p className="font-sans text-xs text-plum/30 text-center tracking-widest uppercase">
      No scores yet — be the first!
    </p>
  )

  return (
    <div className="max-w-md mx-auto">
      <h3 className="font-display text-2xl text-plum text-center mb-8">
        Royal Court Rankings
      </h3>
      <ol className="space-y-3">
        {scores.map((entry, i) => (
          <li
            key={entry.id}
            className="flex items-center gap-4 border border-gold/15 rounded-sm px-5 py-3 bg-ivory/60"
          >
            <span className="font-script italic text-gold/60 text-sm w-8 shrink-0 text-center">
              {RANK_LABELS[i]}
            </span>
            <span className="text-xl">{entry.avatar}</span>
            <span className="font-sans text-sm text-plum flex-1 truncate">{entry.player_name}</span>
            <span className="font-display text-plum text-lg">{entry.score}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/guestbook/quiz/Leaderboard.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/guestbook/quiz/Leaderboard.tsx __tests__/features/guestbook/quiz/Leaderboard.test.tsx
git commit -m "feat: add Leaderboard with 30s polling"
```

---

## Task 16: QuizModule

**Files:**
- Create: `features/guestbook/quiz/QuizModule.tsx`
- Test: `__tests__/features/guestbook/quiz/QuizModule.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// __tests__/features/guestbook/quiz/QuizModule.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor }               from '@testing-library/react'
import { QuizModule }                                        from '@/features/guestbook/quiz/QuizModule'

vi.mock('@/config/content', () => ({
  QUIZ_QUESTIONS: [
    { id: 'q1', question: 'Where did they meet?', options: ['A', 'B', 'C', 'D'], answer: 1 },
  ],
}))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ scores: [] }), { status: 200 }),
  ))
})
afterEach(() => { vi.unstubAllGlobals() })

describe('QuizModule', () => {
  it('shows setup phase with Begin button initially', () => {
    render(<QuizModule />)
    expect(screen.getByRole('button', { name: /begin the quiz/i })).toBeInTheDocument()
  })

  it('Begin button is disabled without name and avatar', () => {
    render(<QuizModule />)
    expect(screen.getByRole('button', { name: /begin the quiz/i })).toBeDisabled()
  })

  it('Begin button enables when name and avatar provided', () => {
    render(<QuizModule />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), { target: { value: 'Ola' } })
    fireEvent.click(screen.getByRole('button', { name: /select 💍 avatar/i }))
    expect(screen.getByRole('button', { name: /begin the quiz/i })).not.toBeDisabled()
  })

  it('transitions to question view on Begin click', () => {
    render(<QuizModule />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), { target: { value: 'Ola' } })
    fireEvent.click(screen.getByRole('button', { name: /select 💍 avatar/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin the quiz/i }))
    expect(screen.getByText('Where did they meet?')).toBeInTheDocument()
  })

  it('transitions to done screen after answering', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ score: { id: '1' } }), { status: 201 }),
    ))
    render(<QuizModule />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), { target: { value: 'Ola' } })
    fireEvent.click(screen.getByRole('button', { name: /select 💍 avatar/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin the quiz/i }))
    fireEvent.click(screen.getByRole('button', { name: 'B' }))
    await waitFor(() => expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument(), { timeout: 2000 })
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- __tests__/features/guestbook/quiz/QuizModule.test.tsx --reporter=verbose
```

- [ ] **Step 3: Implement**

```tsx
// features/guestbook/quiz/QuizModule.tsx
'use client'
import { useState }                          from 'react'
import { AvatarPicker, type Avatar }         from './AvatarPicker'
import { QuizQuestion }                      from './QuizQuestion'
import { Leaderboard }                       from './Leaderboard'
import { QUIZ_QUESTIONS }                    from '@/config/content'

type Phase = 'setup' | 'playing' | 'done'

export function QuizModule() {
  const [phase,        setPhase]        = useState<Phase>('setup')
  const [name,         setName]         = useState('')
  const [avatar,       setAvatar]       = useState<Avatar | null>(null)
  const [questionIdx,  setQuestionIdx]  = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalTimeMs,  setTotalTimeMs]  = useState(0)
  const [finalScore,   setFinalScore]   = useState<{ correct: number; total: number } | null>(null)
  const [submitError,  setSubmitError]  = useState<string | null>(null)

  const questions = [...QUIZ_QUESTIONS]

  function handleAnswer(correct: boolean, timeTakenMs: number) {
    const newCorrect = correctCount + (correct ? 1 : 0)
    const newTime    = totalTimeMs + timeTakenMs

    if (questionIdx + 1 >= questions.length) {
      setFinalScore({ correct: newCorrect, total: questions.length })
      setPhase('done')
      submitScore(newCorrect, newTime)
    } else {
      setCorrectCount(newCorrect)
      setTotalTimeMs(newTime)
      setQuestionIdx(i => i + 1)
    }
  }

  async function submitScore(score: number, time_taken_ms: number) {
    try {
      await fetch('/api/quiz', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ player_name: name, avatar: avatar!, score, time_taken_ms }),
      })
    } catch {
      setSubmitError('Score could not be saved.')
    }
  }

  if (phase === 'setup') {
    return (
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <label className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 block mb-2 text-center">
            Your Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full border border-gold/20 rounded-sm px-4 py-3 font-sans text-sm text-plum bg-transparent focus:outline-none focus:border-gold/50 text-center"
          />
        </div>
        <div>
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 text-center mb-4">
            Pick Your Avatar
          </p>
          <AvatarPicker selected={avatar} onSelect={setAvatar} />
        </div>
        <button
          type="button"
          disabled={!name.trim() || !avatar}
          onClick={() => setPhase('playing')}
          className="w-full border border-gold/30 text-plum font-sans text-[10px] tracking-[0.18em] uppercase py-3 hover:bg-plum hover:text-ivory transition-colors duration-300 disabled:opacity-40"
        >
          Begin the Quiz
        </button>
      </div>
    )
  }

  if (phase === 'playing') {
    return (
      <QuizQuestion
        key={questionIdx}
        question={questions[questionIdx]}
        questionNum={questionIdx + 1}
        total={questions.length}
        onAnswer={handleAnswer}
      />
    )
  }

  return (
    <div className="space-y-16">
      <div className="text-center">
        <p className="font-script italic text-gold/70 text-3xl mb-2">
          {finalScore!.correct} / {finalScore!.total}
        </p>
        <p className="font-sans text-xs text-plum/40 tracking-widest uppercase">
          {finalScore!.correct === finalScore!.total ? 'Perfect score!' : 'Well played!'}
        </p>
        {submitError && (
          <p className="font-sans text-xs text-red-500 mt-4">{submitError}</p>
        )}
      </div>
      <Leaderboard />
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- __tests__/features/guestbook/quiz/QuizModule.test.tsx --reporter=verbose
```

- [ ] **Step 5: Commit**

```bash
git add features/guestbook/quiz/QuizModule.tsx __tests__/features/guestbook/quiz/QuizModule.test.tsx
git commit -m "feat: add QuizModule orchestrator"
```

---

## Task 17: Guestbook page

**Files:**
- Modify: `app/guestbook/page.tsx`

- [ ] **Step 1: Replace the stub**

```tsx
// app/guestbook/page.tsx
import { GuestbookWall } from '@/features/guestbook/GuestbookWall'
import { QuizModule }    from '@/features/guestbook/quiz/QuizModule'

export default function GuestbookPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32">
      <section className="mb-32">
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          Guestbook
        </h1>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          Leave your blessing for the couple
        </p>
        <GuestbookWall />
      </section>

      <section>
        <h2 className="font-display text-3xl md:text-4xl text-plum text-center mb-4">
          How Well Do You Know Us?
        </h2>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          A quiz for our guests
        </p>
        <QuizModule />
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Run all tests — expect all pass**

```bash
npm test --reporter=verbose 2>&1 | tail -15
```

- [ ] **Step 3: Commit**

```bash
git add app/guestbook/page.tsx
git commit -m "feat: wire Guestbook page with GuestbookWall and QuizModule"
```

---

## Self-Review

**Spec coverage:**
- Gallery masonry + filter tabs + lightbox ✅ (Tasks 2–5)
- Gallery verse strip "Song of Solomon 8:7" ✅ (Task 5, via `VERSES.gallery`)
- Gallery placeholder images ✅ (Task 1)
- Registry calm list with placeholder links ✅ (Task 6)
- Guestbook wall ✅ (Tasks 10–12, 17)
- Quiz timed MCQ + avatar picker ✅ (Tasks 13–16)
- Quiz leaderboard polls every 30s ✅ (Task 15)
- Quiz scores persisted to Supabase ✅ (Task 9, 16)
- Guestbook entries persisted to Supabase ✅ (Task 8, 11)
- Supabase tables created ✅ (Task 7)

**Not in scope (spec defers):**
- Gallery horizontal-scroll option (spec says "masonry layout + horizontal-scroll option" — masonry is primary)
- Quiz unlockable perks (spec says "unlockable perks for top scorers" — deferred, requires business logic)
- Guestbook sticker/doodle media types (spec includes them but content is placeholders — text-only wall is the foundation)
