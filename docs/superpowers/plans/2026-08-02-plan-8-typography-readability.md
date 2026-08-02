# Typography & Readability Sweep — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise all readable-content text to legible sizes and opacities across every page; leave watermarks and decorative background elements untouched.

**Architecture:** Apply a consistent ruleset (min opacity `/75` for labels, `/85` for body copy, `font-medium` minimum, no `text-[9px]`/`text-[10px]`/`text-[11px]` for content) by sweeping each feature component. No new abstractions — edit classes in-place.

**Tech Stack:** Next.js App Router, Tailwind CSS 4, TypeScript, Framer Motion

---

## Ruleset Reference

| Role | Min opacity | Min size | Min weight |
|---|---|---|---|
| Body paragraphs | `/85` | `text-base` | `font-medium` |
| Labels / captions / metadata | `/75` | `text-sm` | `font-medium` |
| Buttons / interactive | `/85` | `text-sm` | `font-medium` |
| Verse quotes (expanded) | `/80` | `text-base` | — |
| Nav links (inactive) | `/90` | `text-sm` | `font-medium` |
| **Watermarks / aria-hidden decorative** | **unchanged** | **unchanged** | — |

---

## Task 1: Nav + Footer

**Files:**
- Modify: `components/layout/Nav.tsx`
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Update Nav desktop link classes**

In `Nav.tsx`, the `linkClass` function currently uses `text-[11px]` and `text-ivory/55`. Change it to:

```tsx
const linkClass = (href: string) => [
  'relative text-sm font-sans font-medium tracking-[0.16em] uppercase',
  reduced ? '' : 'transition-colors duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
  pathname === href ? 'text-gold' : 'text-ivory/90 hover:text-ivory',
  'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold after:origin-left',
  reduced ? 'after:scale-x-0' : 'after:transition-transform after:duration-[350ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]',
  pathname === href ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
].join(' ')
```

- [ ] **Step 2: Update Nav mobile hamburger + mobile links**

In `Nav.tsx`, update the hamburger button:
```tsx
// was: text-ivory/60 hover:text-ivory
className="md:hidden text-ivory/80 hover:text-ivory p-1"
```

Update mobile link classes:
```tsx
// was: text-sm ... text-ivory/60 hover:text-ivory
className={[
  'text-base font-sans font-medium tracking-[0.14em] uppercase',
  pathname === href ? 'text-gold' : 'text-ivory/90 hover:text-ivory',
  reduced ? '' : 'transition-colors duration-[150ms]',
].join(' ')}
```

- [ ] **Step 3: Update Footer text**

In `Footer.tsx`, apply these changes:

```tsx
// Verse text: gold/70 → gold/90
<p className="font-script italic text-gold/90 text-xl leading-relaxed">

// Verse ref: text-xs text-gold/40 → text-sm text-gold/75 font-medium
<p className="font-sans font-medium text-sm tracking-[0.18em] uppercase text-gold/75">

// Date label: text-xs text-ivory/30 → text-sm text-ivory/75
<p className="font-sans text-sm tracking-[0.16em] uppercase text-ivory/75">

// Thank you text: text-xs text-ivory/20 → text-sm text-ivory/75
<p className="font-sans text-sm text-ivory/75 pt-2">

// Hashtag (conditional): text-xs text-gold/35 → text-sm text-gold/80
<p className="font-sans text-sm tracking-widest text-gold/80 pt-1">
```

- [ ] **Step 4: Run tests and verify**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm test -- --passWithNoTests 2>&1 | tail -20
```

Expected: all pass. Then start dev server and visually confirm nav links and footer text are clearly readable.

- [ ] **Step 5: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add components/layout/Nav.tsx components/layout/Footer.tsx && git commit -m "fix: raise nav and footer text opacity and size for readability"
```

---

## Task 2: Hero Section + Countdown

**Files:**
- Modify: `features/hero/HeroSection.tsx`
- Modify: `features/hero/AstrolabeCountdown.tsx`

- [ ] **Step 1: Update HeroSection readable text**

In `HeroSection.tsx`, update two elements (leave the verse watermark `text-gold/80` and the `verseOpacity` motion unchanged — it's a decorative fade):

```tsx
// Verse ref span: text-[9px] text-gold/40 → text-sm text-gold/75
<span className="block mt-1 font-sans font-medium text-sm tracking-[0.18em] uppercase text-gold/75 not-italic">
  {VERSES.hero.ref}
</span>

// Wedding date: text-[11px] text-ivory/30 → text-sm text-ivory/75
<motion.p
  ...
  className="font-sans text-sm tracking-[0.22em] text-ivory/75 uppercase mt-3"
>
  {WEDDING.dateLabel}
</motion.p>
```

- [ ] **Step 2: Update AstrolabeCountdown**

In `AstrolabeCountdown.tsx`, update:

```tsx
// HH:MM:SS timer: text-xs text-gold/35 → text-sm text-gold/80
<p
  role="timer"
  aria-label={...}
  className="font-sans text-sm tracking-[0.22em] text-gold/80 tabular-nums"
>
```

Also update the SVG DAYS label opacity and size (inline SVG attributes, not Tailwind):
```tsx
// DAYS label: fontSize="7" opacity="0.55" → fontSize="8" opacity="0.85"
<text
  x={CX} y={CY + 17}
  textAnchor="middle" dominantBaseline="middle"
  fill="#C9A24B" fontSize="8"
  fontFamily="var(--font-sans)" fontWeight="500" letterSpacing="0.18em"
  opacity="0.85"
>
  DAYS
</text>
```

- [ ] **Step 3: Run tests and verify**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm test -- --passWithNoTests 2>&1 | tail -20
```

Visually check the hero: date label and verse reference should now be clearly readable. The verse text itself should retain its fade-out scroll behaviour.

- [ ] **Step 4: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/hero/HeroSection.tsx features/hero/AstrolabeCountdown.tsx && git commit -m "fix: raise hero date, verse ref, and countdown timer opacity/size"
```

---

## Task 3: Story Section + Movement

**Files:**
- Modify: `features/story/StorySection.tsx`
- Modify: `features/story/StoryMovement.tsx`

- [ ] **Step 1: Update StorySection subtitle**

In `StorySection.tsx`, the subtitle is currently `text-plum/28`. Change it:

```tsx
// was: text-plum/28
<p className="font-sans text-sm tracking-[0.26em] uppercase text-plum/75">
  Written in the stars
</p>
```

- [ ] **Step 2: Update StoryMovement PALETTE unfold opacities**

In `StoryMovement.tsx`, update the `PALETTE` constant:

```tsx
const PALETTE = {
  friendship: {
    fragment:    'text-rose/75',
    unfold:      'text-rose/85 hover:text-rose',
    placeholder: 'from-blush via-rose/20 to-blush/60',
  },
  dating: {
    fragment:    'text-lilac/80',
    unfold:      'text-lilac/85 hover:text-lilac',
    placeholder: 'from-indigo/20 via-lilac/15 to-indigo/10',
  },
  proposal: {
    fragment:    'text-gold/80',
    unfold:      'text-gold/85 hover:text-gold',
    placeholder: 'from-gold/15 via-blush/20 to-gold/10',
  },
} as const
```

- [ ] **Step 3: Update StoryMovement period, unfold button, and body text**

In `StoryMovement.tsx`, update three elements:

```tsx
// Period label: text-xs text-plum/30 → text-sm text-plum/75 font-medium
<motion.p
  ...
  className="font-sans text-sm font-medium tracking-[0.22em] uppercase text-plum/75 mb-6"
>

// Unfold button: text-xs → text-sm
<button
  ...
  className={`inline-flex items-center gap-1.5 font-sans text-sm tracking-[0.18em] uppercase transition-colors duration-200 mb-3 ${palette.unfold}`}
>

// Body copy: text-sm text-plum/60 → text-base text-plum/85 font-medium
<p className="font-sans text-base font-medium text-plum/85 leading-relaxed pt-1">
  {movement.body}
</p>
```

- [ ] **Step 4: Update verse blockquote in StoryMovement**

```tsx
// Verse text: text-sm text-plum/50 → text-base text-plum/80
<p className="font-script italic text-base text-plum/80 leading-relaxed">
  {verseText}
</p>
// Verse cite: text-[10px] text-plum/30 → text-sm text-plum/75
<cite className="font-sans not-italic text-sm tracking-[0.18em] uppercase text-plum/75 mt-1 block">
  — {verseRef}
</cite>
```

- [ ] **Step 5: Run tests and verify**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm test -- --passWithNoTests 2>&1 | tail -20
```

Visually check `/our-story`: period labels, unfold button, body text, and verse quote should all be clearly readable.

- [ ] **Step 6: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/story/StorySection.tsx features/story/StoryMovement.tsx && git commit -m "fix: raise story text opacities, period label, body copy, and verse blockquote"
```

---

## Task 4: Schedule (EventBlock) + Registry

**Files:**
- Modify: `features/schedule/EventBlock.tsx`
- Modify: `features/registry/RegistrySection.tsx`

- [ ] **Step 1: Update EventBlock text**

In `EventBlock.tsx`, update all label/value text:

```tsx
// Date + time: text-[11px] text-plum/45 → text-sm text-plum/80 font-medium
<p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/80 mb-1">
  {event.date}
  {!isPlaceholder(event.time) && ` · ${event.time}`}
</p>

// Location: text-sm text-plum/65 → text-base text-plum/85
<p className="font-sans text-base text-plum/85 mb-5">{event.location}</p>

// Dress code label: text-[10px] text-gold/45 → text-sm text-gold/80 font-medium
<p className="font-sans text-sm font-medium tracking-[0.2em] uppercase text-gold/80 mb-1">
  Dress code
</p>

// Dress code value: text-sm text-plum/65 → text-base text-plum/85
<p className="font-sans text-base text-plum/85">{event.dresscode}</p>

// Note: text-xs text-plum/40 → text-sm text-plum/75
<p className="font-sans text-sm text-plum/75 leading-relaxed italic border-l border-gold/20 pl-4 mb-6">
  {event.note}
</p>
```

- [ ] **Step 2: Update RegistrySection DetailRow and tab labels**

In `RegistrySection.tsx`, update the `DetailRow` component:

```tsx
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-sans text-sm uppercase tracking-[0.12em] text-plum/80 mt-2">{label}</p>
      <p className="font-sans text-sm font-semibold text-plum">{value}</p>
    </div>
  )
}
```

Update the tab switcher inactive state (both buttons in the `account` switcher):
```tsx
// was: text-plum/50 (inactive)
// now: text-plum/80
account === 'ng' ? 'bg-plum text-ivory' : 'bg-white text-plum/80'
account === 'intl' ? 'bg-plum text-ivory' : 'bg-white text-plum/80'
```

Update the gift-list back card "Browse our wishlist" label:
```tsx
// was: text-xs text-plum/50
<p className="font-sans text-sm uppercase tracking-[0.12em] text-plum/80 mb-4">
  Browse our wishlist
</p>
```

- [ ] **Step 3: Run tests and verify**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm test -- --passWithNoTests 2>&1 | tail -20
```

Visually check `/d-day` and `/registry` pages.

- [ ] **Step 4: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/schedule/EventBlock.tsx features/registry/RegistrySection.tsx && git commit -m "fix: raise schedule event and registry card text opacity and size"
```

---

## Task 5: Guestbook (Wall, Form, PolaroidCard)

**Files:**
- Modify: `features/guestbook/GuestbookWall.tsx`
- Modify: `features/guestbook/GuestbookForm.tsx`
- Modify: `features/guestbook/PolaroidCard.tsx`

- [ ] **Step 1: Update GuestbookWall**

In `GuestbookWall.tsx`:

```tsx
// Trigger button: text-[11px] text-gold/80 → text-sm text-gold/90 font-medium
<button
  ...
  className="border border-gold/50 px-10 py-3 font-sans text-sm font-medium tracking-[0.18em] uppercase text-gold/90 hover:bg-gold/5 transition-colors"
>

// Modal close button: text-plum/30 → text-plum/60
className="absolute top-4 right-4 text-plum/60 hover:text-plum transition-colors text-lg leading-none"

// Modal subtitle: text-[10px] text-plum/30 → text-sm text-plum/75 font-medium
<p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/75 text-center mb-8">
  Your words mean the world to us
</p>

// Loading state: text-xs text-plum/30 → text-sm text-plum/75 font-medium
<p className="font-sans text-sm font-medium text-plum/75 text-center mt-16 tracking-widest uppercase">
  Loading messages…
</p>

// Empty state: text-xs text-plum/30 → text-sm text-plum/75 font-medium
<p className="font-sans text-sm font-medium text-plum/75 text-center mt-16 tracking-widest uppercase">
  Be the first to leave a message
</p>
```

- [ ] **Step 2: Update GuestbookForm**

In `GuestbookForm.tsx`:

```tsx
// Form labels: text-xs text-plum/70 → text-sm text-plum/85 font-medium (both)
<label className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 block mb-1">

// Submit button: text-xs → text-sm font-medium
<button
  ...
  className="w-full border border-gold/30 text-plum font-sans text-sm font-medium tracking-[0.18em] uppercase py-3 hover:bg-plum hover:text-ivory transition-colors duration-300 disabled:opacity-40"
>

// Success message: text-plum/60 → text-plum/85
<p className="font-script italic text-plum/85 text-2xl text-center py-8">
  Thank you for your blessing ♡
</p>
```

- [ ] **Step 3: Update PolaroidCard message text**

In `PolaroidCard.tsx`, only the message text (the heart ♡ is `aria-hidden` decorative — leave it):

```tsx
// Message: text-[11px] text-plum/70 → text-sm text-plum/85
<motion.p
  ...
  className="font-sans text-sm text-plum/85 leading-relaxed text-center"
>
  {message}
</motion.p>
```

- [ ] **Step 4: Run tests and verify**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm test -- --passWithNoTests 2>&1 | tail -20
```

Visually check `/guestbook`: the trigger button, modal labels, and polaroid message text should all be clearly readable.

- [ ] **Step 5: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/guestbook/GuestbookWall.tsx features/guestbook/GuestbookForm.tsx features/guestbook/PolaroidCard.tsx && git commit -m "fix: raise guestbook wall, form, and polaroid text opacity and size"
```

---

## Task 6: Quiz (Module, Question, Leaderboard)

**Files:**
- Modify: `features/guestbook/quiz/QuizModule.tsx`
- Modify: `features/guestbook/quiz/QuizQuestion.tsx`
- Modify: `features/guestbook/quiz/Leaderboard.tsx`

- [ ] **Step 1: Update QuizModule**

In `QuizModule.tsx`:

```tsx
// Name label + avatar label: text-xs text-plum/50 → text-sm text-plum/80 font-medium (both)
<label className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/80 block mb-2 text-center">
  Your Name
</label>
<p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/80 text-center mb-4">
  Pick Your Avatar
</p>

// "Begin the Quiz" button: text-xs → text-sm font-medium
<button
  ...
  className="w-full border border-gold/30 text-plum font-sans text-sm font-medium tracking-[0.18em] uppercase py-3 hover:bg-plum hover:text-ivory transition-colors duration-300 disabled:opacity-40"
>

// Score text: text-gold/70 → text-gold/90
<p className="font-script italic text-gold/90 text-3xl mb-2">
  {finalScore!.correct} / {finalScore!.total}
</p>

// Score label: text-xs text-plum/40 → text-sm text-plum/75 font-medium
<p className="font-sans text-sm font-medium text-plum/75 tracking-widest uppercase">
  {finalScore!.correct === finalScore!.total ? 'Perfect score!' : 'Well played!'}
</p>

// Saving state: text-xs text-plum/30 → text-sm text-plum/75 font-medium
<p className="font-sans text-sm font-medium text-plum/75 text-center tracking-widest uppercase py-16">
  Saving your score…
</p>
```

- [ ] **Step 2: Update QuizQuestion**

In `QuizQuestion.tsx`:

```tsx
// "Question X of Y": text-xs text-plum/30 → text-sm text-plum/75 font-medium
<p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/75 text-center mb-6">
  Question {questionNum} of {total}
</p>
```

- [ ] **Step 3: Update Leaderboard**

In `Leaderboard.tsx`:

```tsx
// Loading state: text-xs text-plum/30 → text-sm text-plum/75 font-medium
<p className="font-sans text-sm font-medium text-plum/75 text-center tracking-widest uppercase">
  Loading scores…
</p>

// Empty state: text-xs text-plum/30 → text-sm text-plum/75 font-medium
<p className="font-sans text-sm font-medium text-plum/75 text-center tracking-widest uppercase">
  No scores yet — be the first!
</p>

// Rank label: text-gold/60 → text-gold/85
<span className="font-script italic text-gold/85 text-sm w-8 shrink-0 text-center">
  {RANK_LABELS[i]}
</span>
```

- [ ] **Step 4: Run tests and verify**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm test -- --passWithNoTests 2>&1 | tail -20
```

Visually check the quiz on `/guestbook`: question counter, labels, score, and leaderboard should all be readable.

- [ ] **Step 5: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/guestbook/quiz/QuizModule.tsx features/guestbook/quiz/QuizQuestion.tsx features/guestbook/quiz/Leaderboard.tsx && git commit -m "fix: raise quiz module, question counter, and leaderboard text opacity and size"
```

---

## Task 7: Gallery + RSVP Steps

**Files:**
- Modify: `features/gallery/GalleryFilterTabs.tsx`
- Modify: `features/rsvp/StepEntry.tsx`
- Modify: `features/rsvp/StepAttendance.tsx`
- Modify: `features/rsvp/StepDetails.tsx`
- Modify: `features/rsvp/StepConfirmation.tsx`

- [ ] **Step 1: Update GalleryFilterTabs**

In `GalleryFilterTabs.tsx`:

```tsx
// Tabs: text-xs → text-sm; inactive: text-plum/40 → text-plum/70
<button
  ...
  className={`font-sans text-sm tracking-[0.18em] uppercase pb-1 transition-colors duration-200 ${
    active === tab.value
      ? 'text-plum border-b border-gold'
      : 'text-plum/70 hover:text-plum/90'
  }`}
>
```

- [ ] **Step 2: Update StepEntry**

In `StepEntry.tsx`, update the two shared class constants:

```tsx
const inputClass = 'w-full border border-gold/35 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/50 focus:outline-none focus:border-gold/70 transition-colors'
const labelClass = 'block font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 mb-2'
```

Update the submit button:
```tsx
// was: text-[11px] text-gold/80
<button
  type="submit"
  className="w-full border border-gold/50 rounded-sm py-3 font-sans text-sm font-medium tracking-[0.16em] uppercase text-gold/90 hover:bg-gold/5 transition-colors"
>
  Continue
</button>
```

- [ ] **Step 3: Update StepAttendance**

In `StepAttendance.tsx`:

```tsx
// Attend button: text-xs → text-sm font-medium
<button
  ...
  className="w-full border border-gold/60 rounded-sm py-5 font-sans text-sm font-medium tracking-[0.2em] uppercase text-gold hover:bg-gold/8 transition-colors"
>

// Can't attend button: text-xs text-plum/60 → text-sm font-medium text-plum/85
<button
  ...
  className="w-full border border-gold/30 rounded-sm py-5 font-sans text-sm font-medium tracking-[0.2em] uppercase text-plum/85 hover:border-gold/50 hover:text-plum transition-colors"
>
```

- [ ] **Step 4: Update StepDetails**

In `StepDetails.tsx`:

```tsx
// Aso-ebi label: text-xs text-plum/70 → text-sm text-plum/85 font-medium
<p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 mb-1">
  Aso-Ebi Size
  <span className="ml-2 text-plum/75 normal-case tracking-normal">(optional)</span>
</p>

// Helper text: text-xs text-plum/55 → text-sm text-plum/80
<p className="font-sans text-sm text-plum/80 mb-3">
  Coordinated fabric — details shared with confirmed guests
</p>

// Size buttons inactive: text-plum/65 → text-plum/80
selectedSize === size
  ? 'border-gold bg-gold/10 text-gold'
  : 'border-gold/35 text-plum/80 hover:border-gold/55',

// Submit button: text-xs → text-sm font-medium
<button
  ...
  className="w-full border border-gold/60 rounded-sm py-3 font-sans text-sm font-medium tracking-[0.16em] uppercase text-gold hover:bg-gold/5 disabled:opacity-40 transition-colors"
>
```

- [ ] **Step 5: Update StepConfirmation**

In `StepConfirmation.tsx`, the confirmation sub-copy is already `text-sm text-plum/70` — raise opacity:

```tsx
// was: text-plum/70
<p className="font-sans text-sm text-plum/85 leading-relaxed max-w-xs mx-auto">
```

- [ ] **Step 6: Run tests and verify**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm test -- --passWithNoTests 2>&1 | tail -20
```

Visually check `/gallery` tabs and `/rsvp` multi-step form — all labels and buttons should be clearly readable.

- [ ] **Step 7: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add features/gallery/GalleryFilterTabs.tsx features/rsvp/StepEntry.tsx features/rsvp/StepAttendance.tsx features/rsvp/StepDetails.tsx features/rsvp/StepConfirmation.tsx && git commit -m "fix: raise gallery tabs and all RSVP step text opacity and size"
```

---

## Task 8: ScriptureStrip

**Files:**
- Modify: `components/ui/ScriptureStrip.tsx`

- [ ] **Step 1: Update ScriptureStrip**

In `ScriptureStrip.tsx`:

```tsx
// Verse text: text-gold/75 → text-gold/90
<p className="font-script italic text-lg leading-relaxed text-gold/90">
  {text}
</p>

// Reference: text-[10px] text-gold/45 → text-sm text-gold/80 font-medium
<p className="mt-3 font-sans font-medium text-sm tracking-[0.18em] uppercase text-gold/80">
  {reference}
</p>
```

- [ ] **Step 2: Run full test suite**

```bash
cd "/Users/dimeji/docs/Wedding Website" && npm test 2>&1 | tail -30
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
cd "/Users/dimeji/docs/Wedding Website" && git add components/ui/ScriptureStrip.tsx && git commit -m "fix: raise scripture strip verse and reference text opacity and size"
```

---

## Final Verification

- [ ] Start dev server: `npm run dev`
- [ ] Visit each page and confirm all readable content is legible at a normal viewing distance:
  - `/` — hero date label, verse ref, countdown timer
  - `/our-story` — subtitle, period labels, unfold button, body text, verse blockquote
  - `/d-day` — event date/time, location, dress code, note
  - `/gallery` — filter tab labels
  - `/guestbook` — trigger button, polaroid messages, quiz labels and scores
  - `/rsvp` — all form labels, buttons, helper text
  - `/registry` — detail row labels, tab switcher, browse label
  - Nav (all pages) — inactive link text
  - Footer (all pages) — verse, ref, date, thank-you text
- [ ] Confirm watermarks remain subtle: verse overlay behind story hero photos, Roman numeral glyphs in story section background
