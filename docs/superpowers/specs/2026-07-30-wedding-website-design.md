# Wedding Website Design Spec
**Feyisogo & Oladimeji (Dimeji)**
**Wedding Date:** February 18, 2027
**Spec Date:** 2026-07-30

---

## 1. Project Overview

A one-of-a-kind wedding website for a Yoruba-Christian couple. Creative concept: **"A Love Written in the Stars and the Soil"** — Afrofuturism + high fantasy + Yoruba heritage, threaded with quiet Christian faith. Ancient royal court reimagined through a sci-fi lens. Fast, accessible, flawless on mobile.

**Not a template.** Every scroll, hover, and transition is intentional, cinematic, and slightly magical.

---

## 2. Confirmed Decisions

| Decision | Choice |
|----------|--------|
| Framework | Next.js App Router + TypeScript |
| Styling | Tailwind CSS + CSS custom properties (`config/tokens.css`) |
| Motion | Framer Motion + Lenis (inertial scroll) |
| Backend | Supabase (RSVP storage + quiz leaderboard) |
| CMS | None — central `config/content.ts` for all copy |
| Hero | Animated canvas fallback (starfield + particles); video `<slot>` for later |
| RSVP | Manual entry only (no pre-loaded guest list) |
| Audio | "Can't Help Falling in Love" – Elvis Presley (file supplied separately; infrastructure built as placeholder) |
| Architecture | Feature-based folders (Approach B) |
| Deployment | Vercel |
| Maps | Mapbox GL |
| Particles | Custom canvas (`requestAnimationFrame`), auto-throttle on low-power devices |

---

## 3. Design Token System

### 3.1 Color Palette

```css
/* config/tokens.css */
:root {
  /* Base */
  --color-ivory:        #FBF6F0;  /* page background */
  --color-blush:        #F7E8E4;  /* alternate section bg */
  --color-plum:         #231622;  /* dark sections, hero overlay */

  /* Yoruba Royal */
  --color-indigo:       #2C2A4A;  /* adire blue accent */
  --color-gold:         #C9A24B;  /* lines, borders, icons — hairline use only */

  /* Fantasy Glow */
  --color-rose:         #E6A9C0;  /* magenta-rose glow accent */
  --color-lilac:        #B9A6E0;  /* holographic teal-lilac hover shimmer */
}
```

**Gold rule:** used as *line weight* only — hairline borders, icon strokes, dividers, typography. Never large fills.

### 3.2 Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Names | Playfair Display | 700 | Headlines, couple names, section titles |
| Script / Calligraphic | Cormorant Garamond | 300 italic | Couple names in hero, verse callouts — sparingly |
| Body / UI | Inter | 300–400 | Readability on forms, schedules, body copy |
| All-caps Labels | Inter | 500 | `letter-spacing: 0.18em` — gold foil feel; nav, section labels |
| Scripture | Cormorant Garamond | 300 italic | ~70% gold opacity for watermark; full opacity for divider strips |

All fonts free via Google Fonts. Self-host in `public/fonts/` for performance.

### 3.3 Motion Tokens

```ts
export const motion = {
  fast:       '150ms',   // button glow, icon states
  base:       '350ms',   // nav underline, card reveals
  slow:       '700ms',   // section entry, timeline cards
  cinematic:  '1200ms',  // hero letter trace-in, gate unlock shimmer
  silk:       'cubic-bezier(0.22, 1, 0.36, 1)',   // primary easing
  gentle:     'cubic-bezier(0.4, 0, 0.2, 1)',     // scroll-triggered entry
}
```

**Reduced motion:** every animated element has a `prefers-reduced-motion` fallback. Manual "Calm Mode" toggle in the UI.

### 3.4 Spacing Scale

```css
--space-1:  4px;   /* icon gap, fine detail */
--space-2:  8px;   /* label gap, tight groups */
--space-4:  16px;  /* component padding */
--space-6:  24px;  /* card padding */
--space-10: 40px;  /* section gap */
--space-20: 80px;  /* section padding top/bottom */
--space-32: 128px; /* hero vertical rhythm */
```

---

## 4. Folder Structure

```
/
├── app/
│   ├── layout.tsx                  # Root: fonts, audio toggle, nav, Lenis
│   ├── page.tsx                    # Hero (/)
│   ├── our-story/page.tsx
│   ├── love-letters/page.tsx
│   ├── schedule/page.tsx           # Gate 1 (time)
│   ├── travel/page.tsx             # Gate 1 (time) + Gate 2 (RSVP)
│   ├── rsvp/page.tsx
│   ├── gallery/page.tsx
│   ├── guestbook/page.tsx          # Quiz + leaderboard
│   ├── registry/page.tsx
│   └── api/
│       ├── rsvp/route.ts
│       ├── guestbook/route.ts
│       ├── quiz/route.ts
│       └── gate/route.ts           # Server-side gate check
│
├── features/
│   ├── hero/
│   │   ├── HeroSection.tsx
│   │   ├── AstrolabeCountdown.tsx
│   │   └── StarfieldCanvas.tsx
│   ├── timeline/
│   │   ├── TimelineSection.tsx
│   │   ├── MilestoneCard.tsx
│   │   └── ConstellationThread.tsx
│   ├── love-letters/
│   │   └── ScrapbookModule.tsx
│   ├── schedule/
│   │   ├── EventBlock.tsx
│   │   └── AddToCalendarButton.tsx
│   ├── travel/
│   │   ├── MapSection.tsx
│   │   └── LogisticsCard.tsx
│   ├── rsvp/
│   │   ├── RSVPFlow.tsx
│   │   ├── StepEntry.tsx
│   │   ├── StepAttendance.tsx
│   │   ├── StepDetails.tsx
│   │   ├── StepConfirmation.tsx
│   │   └── BeadProgressBar.tsx
│   ├── gallery/
│   │   ├── GallerySection.tsx
│   │   └── LightboxModal.tsx
│   ├── guestbook/
│   │   ├── GuestbookWall.tsx
│   │   ├── PolaroidCard.tsx
│   │   └── quiz/
│   │       ├── QuizModule.tsx
│   │       ├── AvatarPicker.tsx
│   │       └── Leaderboard.tsx
│   └── registry/
│       └── RegistrySection.tsx
│
├── components/
│   ├── ui/
│   │   ├── GatedPage.tsx
│   │   ├── Button.tsx
│   │   ├── ScriptureStrip.tsx
│   │   ├── AdireBackground.tsx
│   │   └── AudioToggle.tsx
│   └── layout/
│       ├── Nav.tsx
│       └── Footer.tsx
│
├── config/
│   ├── content.ts                  # All copy — names, dates, milestones, verses
│   ├── reveal.ts                   # Gate unlock dates (UTC)
│   └── tokens.css                  # CSS custom properties
│
├── lib/
│   ├── supabase.ts
│   ├── gate.ts                     # getPageAccess() — server-side only
│   └── hooks/
│       ├── useAudio.ts
│       ├── useReducedMotion.ts
│       └── useParticles.ts
│
└── public/
    ├── fonts/
    ├── audio/                      # Drop "cant-help-falling-in-love.mp3" here
    ├── images/
    └── textures/                   # adire-pattern.svg
```

---

## 5. Page-by-Page Spec

### A. Hero `/`
- Full-bleed animated canvas: starfield particles (low density, GPU-cheap), animated adire SVG texture at ~5% opacity drifting slowly
- Video `<slot>` wired but hidden until couple supplies footage
- Couple names: `Feyisogo & Oladimeji` — Playfair Display 700 + Cormorant italic, slow reveal (letters trace in like gold foil catching light, 1200ms cinematic)
- Verse watermark: *"He has made everything beautiful in its time." — Ecclesiastes 3:11* fades to ~15% opacity on scroll
- `AstrolabeCountdown` to February 18, 2027 — styled as star-dial, not digital clock
- Floating hearts/stars particles, pausable via reduced-motion toggle
- Scroll cue: drum-beat pulse or soft glowing chevron

### B. Our Story `/our-story`
- Vertical scroll-triggered timeline — 10 chapters from `our-story.md`
- **Chapter 3 is blank** — flagged as placeholder; couple to supply content
- Timeline styled as unfurling adire scroll / beaded thread
- Each `MilestoneCard`: fade + rise + slight photo parallax on scroll
- `ConstellationThread` SVG connects milestone nodes
- Verse callout mid-timeline: *"Though one may be overpowered..." — Ecclesiastes 4:12*
- Key milestones pre-loaded from `config/content.ts`:
  - April 8, 2018 — First meeting, Covenant University chapel
  - End of semester 2018 — 5-hour Instagram conversation
  - 2018–2023 — Friendship across continents (Germany / USA)
  - December 2023 — Feyisogo visits Germany; the hug
  - 2024 — Dimeji visits USA twice; families meet
  - January 2, 2025 — Officially a couple (after NYE at Museum of the Bible, D.C.)
  - 2025 — Long-distance but closest ever; wedding playlist discovered
  - January 2026 — Feyisogo relocates to Germany
  - February 2026 — Both families meet in Lagos, Nigeria
  - March 2026 — Proposal in Mallorca, Spain

### C. Love Letters `/love-letters`
- Digital scrapbook: page-flip / unfold animation
- Cards rendered on textured parchment/adire background
- Couple or guests can leave handwritten-style notes

### D. Schedule `/schedule` — 🔒 Gate 1
- Gate 1 (time-based): renders teaser with astrolabe countdown pre-unlock
- Full content: 3 event blocks (Traditional Engagement, Church Ceremony, Reception)
- Each block: time, dress code, cultural note, Add-to-Calendar (Google + ICS)
- Verse strip: *"Ruth 1:16–17"* near ceremony details
- Nav shows lock glyph + "Unlocks [date]" tooltip pre-threshold; dissolves with gold shimmer on unlock

### E. Travel `/travel` — 🔒 Gate 1 + Gate 2
- Gate 1 (time) + Gate 2 (RSVP confirmed "attending")
- Partial state: shows city/region, hotel names, airport distance — no addresses or booking codes
- Full state: Mapbox embed with filtered pins (Ceremony, Reception, Hotels, Airport), exact addresses, hotel booking codes
- "RSVP to unlock full travel details" CTA in partial state
- No verse strip on Travel (functional page; verse budget already spent on Schedule)

### F. RSVP `/rsvp`
- Manual entry, multi-step:
  1. Name + contact details
  2. Attending Y/N (branches)
  3. (If attending) Guest count, dietary, song request, aso-ebi size
  4. Confirmation: particle burst, couple names, thank-you message
- `BeadProgressBar`: cowrie-bead string filling in per step
- React Hook Form + Zod validation
- Saves to Supabase `rsvp` table; sets `rsvpStatus: 'attending' | 'not_attending'`
- RSVP status used for Travel Gate 2 check
- Verse strip: *"1 Corinthians 13:4–7"* above or below form

### G. Gallery `/gallery`
- Masonry layout + horizontal-scroll option
- Filter tabs: Traditional Engagement · Pre-wedding · Family
- Lightbox with soft parallax
- Placeholder: `[GALLERY_IMAGES]` array in `config/content.ts`
- Verse callout: *"Song of Solomon 8:7"*

### H. Guestbook + Quiz `/guestbook`
- **Guestbook wall**: masonry physics board; guests drop polaroid, sticker, or doodle
- **Quiz module**:
  - Timed multiple-choice (speed + accuracy scored)
  - Avatar picker: rings, cake, agogo drum, champagne, cowrie shell
  - Questions loaded from `config/content.ts` (couple to supply real questions; placeholders provided)
  - Live top-10 leaderboard styled as royal court ranking scroll
  - Unlockable perks for top scorers (pick reception song, early buffet access)
  - Scores persist in Supabase `quiz_scores` table; leaderboard polls every 30s

### I. Registry `/registry`
- Simple, calm list/links — no animation, clear and readable
- Couple to supply links

### J. Footer
- Verse: *"Song of Solomon 8:7"* — centered italic, no icon, no graphic
- Couple names, thank-you note, wedding hashtag (if any)
- Social hashtag: `[WEDDING_HASHTAG]` placeholder

---

## 6. Time-Gating Architecture

```ts
// config/reveal.ts
export const UNLOCK_DATES = {
  schedule: new Date('2026-11-20T00:00:00Z'),
  travel:   new Date('2026-11-20T00:00:00Z'),
}

// lib/gate.ts — SERVER SIDE ONLY, never imported in client components
export function getPageAccess(
  page: 'schedule' | 'travel',
  rsvpStatus?: string
): { state: 'teaser' | 'partial' | 'full'; unlocksAt?: Date } {
  const now = new Date()
  if (now < UNLOCK_DATES[page]) {
    return { state: 'teaser', unlocksAt: UNLOCK_DATES[page] }
  }
  if (page === 'travel' && rsvpStatus !== 'attending') {
    return { state: 'partial' }
  }
  return { state: 'full' }
}
```

- All gate checks run in Next.js Server Components / Route Handlers
- Preview bypass: signed `?preview=TOKEN` param (token stored in env var)
- Unlock dates stored in UTC; displayed in visitor's local timezone
- Nav lock glyph dissolves with gold shimmer on first load post-unlock

---

## 7. Supabase Schema

```sql
-- RSVP responses
create table rsvp (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text,
  attending boolean not null,
  guest_count int default 1,
  dietary text,
  song_request text,
  asoebi_size text,
  rsvp_status text generated always as (
    case when attending then 'attending' else 'not_attending' end
  ) stored
);

-- Quiz scores
create table quiz_scores (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  player_name text not null,
  avatar text not null,
  score int not null,
  time_taken_ms int not null
);

-- Guestbook entries
create table guestbook (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  author_name text not null,
  message text,
  media_type text,   -- 'polaroid' | 'sticker' | 'doodle'
  media_url text,
  position_x float,  -- for physics board layout
  position_y float
);
```

---

## 8. Content Placeholders

All managed in `config/content.ts`. Items to fill in before launch:

| Placeholder | Status |
|-------------|--------|
| `BRIDE_NAME` | Feyisogo ✅ |
| `GROOM_NAME` | Oladimeji ✅ |
| `WEDDING_DATE` | February 18, 2027 ✅ |
| `OUR_STORY_MILESTONES` | 10 chapters ✅ (Chapter 3 blank ⚠️) |
| `HERO_VIDEO_URL` | Pending — animated canvas fallback active |
| `GALLERY_IMAGES` | Pending |
| `VENUE_NAME` | Pending |
| `EVENT_DETAILS` | Pending (3 events) |
| `HOTEL_RECOMMENDATIONS` | Pending |
| `SCHEDULE_UNLOCK_DATE` | Pending — suggest 2026-11-20 |
| `QUIZ_QUESTIONS` | Pending — 8–10 questions about the couple |
| `WEDDING_HASHTAG` | Pending |
| `AUDIO_FILE` | "Can't Help Falling in Love" — Elvis Presley (drop in `public/audio/`) |
| `REGISTRY_LINKS` | Pending |
| `MAPBOX_API_KEY` | Pending |
| `SUPABASE_URL + ANON_KEY` | Pending |
| `PREVIEW_TOKEN` | Pending — generate before deployment |

---

## 9. Build Order

Per brief Section 10:

1. Design tokens + `config/tokens.css`
2. `config/content.ts` with all placeholders
3. `config/reveal.ts` + `lib/gate.ts` + `<GatedPage>` wrapper
4. Root layout: Lenis, fonts, `<Nav>`, `<AudioToggle>`, `<AdireBackground>`
5. Hero: `StarfieldCanvas`, `AstrolabeCountdown`, name reveal animation
6. Our Story: `TimelineSection`, `MilestoneCard`, `ConstellationThread`
7. Love Letters: `ScrapbookModule`
8. Schedule (gated)
9. Travel (gated, double-gated)
10. RSVP flow: multi-step + Supabase write
11. Gallery
12. Guestbook + Quiz + Leaderboard
13. Registry
14. Footer + verse integration
15. Performance pass: lazy-loading, image optimization, particle throttle, Lighthouse audit

---

## 10. Performance & Accessibility Targets

- Lighthouse Performance ≥ 90 mobile, Accessibility ≥ 95
- Mobile-first: tested at 390px, 768px, 1024px, 1440px, ultra-wide
- `next/image` with proper sizing on all images
- Hero video (when added): muted, <10s loop, modern codec + poster-frame fallback
- Particles: auto-throttle / disable on `prefers-reduced-motion` + low-power devices
- All interactive components: keyboard navigable, screen-reader compatible
- WCAG AA contrast for all text including pastel combinations (rose-on-ivory tested)
- Graceful degradation: site fully readable with JS disabled

---

*End of spec. Chapter 3 of "Our Story" is the only content gap flagged — all other sections have sufficient information to build.*
