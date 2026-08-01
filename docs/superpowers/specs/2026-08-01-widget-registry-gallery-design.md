# Widget, Registry & Gallery Design Spec

## Overview

Three targeted changes to the wedding website:
1. **Floating Quiz Widget** — the quiz moves out of `/guestbook` into a persistent bottom-left drawer available on every page
2. **"Ode to the Couple" rename** — `/guestbook` page loses the quiz section; the message wall stays and the page is renamed
3. **Registry Flip Cards** — replace the static registry list with two interactive 3D flip cards
4. **Gallery Category Update** — change filter tabs from 4 categories to 3

---

## 1. Floating Quiz Widget

### Trigger Button
- Fixed position: **bottom-left**, `bottom: 24px; left: 24px`
- Shape: circle, 56×56px, plum background (`#5b3d6e`), drop shadow
- Icon: SVG trophy (no emoji) — white stroke, elegant lines
- `z-index: 50` to float above all page content
- Mounted in `app/layout.tsx` so it persists across all routes

### Open State: Slide-Up Drawer
- When triggered: a half-screen drawer slides up from the bottom of the viewport
- Dimmed backdrop (`bg-black/40`) behind it; tapping backdrop closes
- Drawer max-height: `70vh`, rounded top corners (`rounded-t-2xl`)
- Header: "How Well Do You Know Us?" title + close button (×)
- Body: scrollable, contains the full `<QuizModule />` component unchanged
- Drawer animates in with Framer Motion (`y: "100%" → y: 0`)

### State
- Toggle state lives in `QuizWidgetButton` (a new `'use client'` component)
- Mounted once in layout, no props needed — self-contained

### File changes
- **New:** `features/quiz-widget/QuizWidgetButton.tsx` — trigger button + drawer shell
- **Modify:** `app/layout.tsx` — import and render `<QuizWidgetButton />`
- **Modify:** `app/guestbook/page.tsx` — remove the quiz section entirely
- The quiz files themselves (`features/guestbook/quiz/*`) are not moved; they stay in place and are imported by the widget

---

## 2. "Ode to the Couple" Page Rename

### Changes
- Page `<h1>` changes from "Guestbook" to "Ode to the Couple"
- Subtitle changes to "Leave your blessing for us"
- The quiz `<section>` is removed from `app/guestbook/page.tsx`
- Nav link label changes from "Guestbook" to "Ode to the Couple" in `config/content.ts`
- URL stays `/guestbook` — no redirect needed

---

## 3. Registry Flip Cards

### Layout
- Two cards side by side (`flex gap-8 justify-center flex-wrap`) in `RegistrySection`
- Each card: `w-64 h-80` (256×320px), `perspective-[900px]`
- Cards flip on click (toggle `rotateY(180deg)`) using CSS 3D transform
- Framer Motion used for the flip transition (`transition: { duration: 0.65, ease: [0.4,0,0.2,1] }`)

### Card 1 — "Give to the Couple"
**Front face:**
- Background: plum gradient (`from-[#5b3d6e] to-[#7a5490]`)
- SVG heart icon (white, layered with stars — same as mockup)
- Title: "Give to the Couple" (uppercase, tracked)
- Subtitle: "Tap to see account details"

**Back face:**
- Ivory background (`#fffaf6`), plum border
- Two toggle tabs: "🇳🇬 Nigerian" / "🌍 International" — tab switch is local state, does NOT re-trigger the card flip
- **Nigerian tab:** Account Name · Bank · Account No. · Sort Code (all placeholder text)
- **International tab:** Account Name · IBAN · BIC/SWIFT · Bank (all placeholder text)
- Tab clicks use `e.stopPropagation()` so they don't flip the card back

### Card 2 — "Gift List"
**Front face:**
- Background: gold gradient (`from-[#9c6b38] to-[#c4904a]`)
- SVG gift box with ribbon and bow (white, same as mockup)
- Title: "Gift List"
- Subtitle: "Tap to explore our wishlist"

**Back face:**
- Ivory background, gold border
- SVG linked-rings icon (gold)
- "Browse our wishlist" label
- Two CTA buttons: "Amazon List" (plum) and "Giftwhale" (gold) — both `href="#"` placeholder links, open in new tab
- Buttons use `e.stopPropagation()` so they don't flip the card back

### File changes
- **Modify:** `features/registry/RegistrySection.tsx` — replace list with two flip cards
- No config changes needed (links are placeholder `#` for now)

---

## 4. Gallery Category Update

### Changes
- `GalleryImage['category']` type in `config/content.ts` changes from `'traditional' | 'pre-wedding' | 'family'` to `'couple-journey' | 'proposal'`
- `GALLERY_IMAGES` placeholder entries updated to use new categories
- `GalleryFilterTabs` tabs update from 4 to 3: `All` · `Couple Journey` · `Proposal Photos`
- Filter logic in `GalleryGrid` unchanged — it already filters by `entry.category === activeCategory`

### File changes
- **Modify:** `config/content.ts` — update `GalleryImage` type + image entries
- **Modify:** `features/gallery/GalleryFilterTabs.tsx` — update tab definitions

---

## Testing

- Snapshot/unit test for `QuizWidgetButton` (renders closed, opens on click, closes on backdrop click)
- Snapshot test for `RegistrySection` — both cards render, tab switch shows correct panel
- Update existing gallery filter tab test to use new category names
- Existing quiz tests unchanged (quiz logic files not touched)
