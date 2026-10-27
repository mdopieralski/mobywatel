---
title: Crimson as the main brand colour
status: accepted
date: 2026-10-24
decided_by: the user
owner: brand-designer
---

# Crimson as the main brand colour

## Decision

The accent (main brand colour) changes from deep teal `#0A6660` to **crimson `#DC143C`**, the user's choice.

| Token        | Light     | Dark      | Why                                                    |
| ------------ | --------- | --------- | ------------------------------------------------------ |
| `accent`     | `#DC143C` | `#FF6B81` | The chosen crimson; a lighter crimson keeps AA on dark |
| `accentText` | `#FFFFFF` | `#0F1318` | White on crimson 5.0:1; ink on light crimson 6.8:1     |
| `accentSoft` | `#FFF5F6` | `#3A1A21` | Tint for notices; crimson on it 4.7:1 / 5.7:1          |

All other tokens are unchanged. `THEME_COLOR` (manifest and browser UI) follows the accent automatically.
`tokens.test.ts` passes for every pair.

## Context

- mobywatel.ai uses `#DC143C` as its accent. Crimson reads as "Polish public service" at once.
- Our earlier choice of teal avoided white and red because they carry the state's identity. The guardrail
  itself (`prototype-guardrails`) forbids the emblem and white-red-eagle cues, not the colour red. The user
  chose to accept the closer resemblance.

## Consequences

- Guardrails matter more now. Red is never combined with an eagle, crown, shield, flag ribbon or
  white-over-red stripes, and the disclaimer and "PROTOTYP" badge stay visible on every screen.
- `danger` stays a darker brick red (`#A8231B` / `#FF8A80`). Errors must always carry an icon and words, so
  they are never distinguished from the brand by colour alone (WCAG 1.4.1).
- The crimson passes AA (4.5:1) but not AAA. Keep body text in `text`, not in the accent.
- **App icon (decided 2026-10-26, the user):** a white tick on a crimson rounded tile
  (`apps/pwa/public/icons/favicon.svg`; PNGs via `pnpm --filter @mobywatel/pwa run icons`, crimson backgrounds
  in `pwa-assets.config.ts`). The user first chose a crimson tick on white, then inverted it. This sits closer
  to mobywatel.ai's logo tile (white eagle on crimson); the tick shape and the "Sprawnie" name keep it apart.
  Never add a bird, crown or shield to this tile.
