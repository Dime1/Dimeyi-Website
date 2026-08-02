# Typography & Readability Sweep — Design Spec

**Date:** 2026-08-02
**Goal:** Make all readable content clearly legible — larger font sizes, bolder weights, and opacities high enough to read without straining. Watermarks and decorative background elements remain subtle.

---

## Ruleset

### Opacity minimums (readable content only)

| Role | Old range | New minimum |
|---|---|---|
| Body copy paragraphs | `/60` | `/85` |
| Labels, captions, metadata | `/28`–`/45` | `/75` |
| Secondary / supporting text | `/50` | `/70` |
| Buttons & interactive text | `/50`–`/55` | `/85` |
| Scripture verse quote (expanded) | `/50` | `/80` |
| Nav links (inactive) | `/55` | `/90` |
| Footer text | `/50` | `/80` |

### Font size minimums (readable content only)

| Old class | New class |
|---|---|
| `text-[9px]`, `text-[10px]`, `text-[11px]` | `text-sm` |
| `text-xs` (labels, captions) | `text-sm` |
| `text-xs` (body copy) | `text-base` |
| `text-sm` (body paragraphs) | `text-base` |

### Font weight minimums

| Role | New minimum |
|---|---|
| All labels, captions, metadata | `font-medium` |
| Body copy | `font-medium` |
| Buttons / interactive | `font-medium` |
| Headings | unchanged (`font-bold`) |

---

## Scope

All feature components swept in one pass:

- `features/hero/` — date label, verse text + ref, CTA button
- `features/story/StorySection.tsx` — page subtitle
- `features/story/StoryMovement.tsx` — period label, unfold button, body copy, verse blockquote
- `features/gallery/` — tab labels, caption text, lightbox controls
- `features/guestbook/` — form labels, entry text, character count
- `features/registry/` — card labels, hint text, button labels
- `features/rsvp/` — form labels, step text, helper hints
- `features/schedule/` (d-day) — event labels, dress code, location, time, countdown
- `features/quiz/` — question text, option labels, score text
- Navigation component — nav links, mobile menu
- Footer component — verse, names, credits

## Exclusions (stay subtle)

- Verse watermarks overlaid on hero images (`text-white/20`)
- Large Roman numeral background glyphs (`text-plum/[0.028]`)
- `aria-hidden` decorative elements
- "Coming soon" placeholder in empty image slots — raise slightly to `/40` so it reads as intentional placeholder, not a bug

---

## Success criteria

- No readable text below opacity `/70` anywhere in the app
- No readable content text below `text-sm`
- All interactive elements (buttons, links) at `font-medium` minimum
- Watermarks and background decorations unchanged
