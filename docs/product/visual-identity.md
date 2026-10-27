---
title: Visual identity
owner: brand-designer (edits with the user's OK; docs/product/ belongs to product-manager)
status: draft, awaiting review
updated: 2026-10-24 (crimson accent)
sources:
  - https://mobywatel.ai/ (CSS variables and font links read 2026-10-24)
  - packages/brand/src/tokens.ts (the source of truth for every value below)
---

# Visual identity

How the prototype looks. The values live in code (`@mobywatel/brand`), and this doc explains the choices and
the rules. If they disagree, the code wins and this doc gets fixed in the same PR. The words are in
`brand-voice.md`. The values behind both are in `brand-voice.md` §2.

Character: **calm, neutral, trustworthy, high contrast.** One accent colour, used sparingly for the main
action and the current place. Most of the screen is neutral.

## 1. Starting point: mobywatel.ai

The challenge site (read 2026-10-24) uses a cool grey page (`#F2F3F7`), near-black ink (`#111216`), navy
(`#1D2850`) and crimson red (`#DC143C`), with the system font stack and Inter as a fallback.

We take the cool neutrals, the high contrast, the system font and the crimson accent. We leave out the navy.

## 2. Crimson as the accent, never as an emblem

The user chose **crimson `#DC143C`** as the main brand colour on 2026-10-24
(`docs/decisions/brand-colour-2026-10-24.md`). It is the challenge site's accent and reads at once as "Polish
public service". Because white and red also carry the state's identity, the rest of the guardrails matter more
now:

- Red is a colour, never a symbol: no eagle, crown, shield, flag ribbon or white-over-red stripes.
- No mObywatel name or wordmark styling, and nothing that copies mobywatel.ai's logo tile.
- The disclaimer and the "PROTOTYP" badge stay visible, so the red never makes a screen look official.
- Errors and destructive actions also use red (`danger`, a darker brick red). They always carry an icon and
  words too, so they are never told apart from the brand by colour alone.

## 3. Colour roles

From `packages/brand/src/tokens.ts`:

| Token           | Light     | Dark      | Use                                                        |
| --------------- | --------- | --------- | ---------------------------------------------------------- |
| `bg`            | `#F5F7F9` | `#0F1318` | Page background                                            |
| `surface`       | `#FFFFFF` | `#171C23` | Cards, sheets                                              |
| `surfaceRaised` | `#FFFFFF` | `#1F252E` | Dialogs, toasts                                            |
| `text`          | `#14181F` | `#EEF1F5` | Body text and headings                                     |
| `textMuted`     | `#49525E` | `#A9B2BF` | Hints, secondary text (still AA, never for key info)       |
| `border`        | `#D5DAE1` | `#2C333D` | Decorative dividers only                                   |
| `borderStrong`  | `#6B7480` | `#7A8494` | Input and control outlines (3:1 non-text contrast)         |
| `accent`        | `#DC143C` | `#FF6B81` | Primary button, active navigation item, links              |
| `accentText`    | `#FFFFFF` | `#0F1318` | Text on `accent`                                           |
| `accentSoft`    | `#FFF5F6` | `#3A1A21` | Highlighted notices, selected rows                         |
| `focus`         | `#1F5FD1` | `#8AB4FF` | Focus ring only (blue, so it never looks like a selection) |
| `danger`        | `#A8231B` | `#FF8A80` | Errors, destructive actions                                |
| `warning`       | `#7D4A00` | `#F2B66D` | Deadlines coming up                                        |
| `success`       | `#1D6631` | `#7BD58F` | Done, sent, valid                                          |
| `watermark`     | 7 % ink   | 8 % white | "PROTOTYP – nie jest dokumentem" on document views         |

Contrast in light / dark (enforced by `tokens.test.ts`):

- Text on background: 16.6 / 16.5.
- Muted text on a surface: 7.9 / 8.0.
- Accent on a surface: 5.0 / 6.3.
- Text on the accent: 5.0 / 6.8.
- Accent on its tint (`accentSoft`): 4.7 / 5.7.
- Status colours (danger, warning, success) on a surface: 7.0 or more.
- Strong borders: 4.5 or more.
- Focus ring: 5.4 or more.

Every text pair passes AA (4.5:1). The crimson accent passes AA but not AAA, so body text stays in `text`, not
in the accent.

## 4. Typography

**Family:** the system UI stack (`FONT_FAMILY`):
`system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Helvetica Neue', Arial, sans-serif`. It is the
font people already read on their phones (SF Pro on iPhone, Roboto on Android). It has full Polish diacritics,
costs no download and works offline from the first load.

An option for review is self-hosted **Inter** (latin-ext, weights 400/600/700, precached) for one identical
look on every device. It costs extra bytes on the jury's first open. Recommendation: stay on the system stack.

**Scale** (px; senior mode in brackets; rem-based, so it follows the user's system text size):

- Hints: `sm` 15 (19).
- Body: `md` 17 (21). Body is 17 px rather than 16 because most users are on a phone and many are older.
- Lead text and card titles: `lg` 20 (25).
- Section headings: `xl` 24 (30).
- Screen titles: `2xl` 30 (36).
- Big numbers: `3xl` 36 (42).
- Legal small print only: `xs` 13 (17).

**Rules:**

- Weights: 400 for text, 600 for labels, buttons and headings, and 700 only for key numbers.
- Line height: 1.5 for body text and 1.25 for headings.
- Align text left and never justify it. Keep lines to about 70 characters.
- Don't set sentences in all caps. The only exception is the short "PROTOTYP" badge.
- The layout must survive 200 % zoom and 320 px reflow.

## 5. Shape, space and motion

- Radius: 8, 12 and 16 px. Badges are pills.
- Spacing follows a 4 px grid.
- Touch targets are at least 48 px, or 56 px in senior mode.
- Motion lasts 120–320 ms and is used only to explain a change. It drops to zero under
  `prefers-reduced-motion`.
- Themes:
  - light and dark are full themes, not inverted colours;
  - senior mode changes size, not colour;
  - `prefers-contrast: more` and `forced-colors` are to do (`brand-designer`).

## 6. Rules

- Colour never carries meaning alone. Status always has a word and an icon too.
- Tokens only, no hex values in `apps/` or `packages/ui` (the post-edit hook blocks them).
- Use one primary (accent) button per screen.
- Don't use gradients, glow, flag colours, gold "official" trims, seals, guilloches or holograms.
- Document views are neutral cards with fictional data and the diagonal watermark.
- Icons are our own (the app icon is being chosen on `/brand-voice`) and simple line icons. Never the official
  icon set.
