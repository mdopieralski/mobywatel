/*
 * Class lists shared by the desktop pages (landing "/" and /prototype). Everything from tokens; the phone is
 * our own neutral drawing, no real device art. docs/decisions/tailwind-2026-10-28.md.
 */

/*
 * Narrow desktop windows use `[@media(max-width:72rem)]:`, the same query as NARROW in showcase-hero.tsx.
 * Not `max-[72rem]:`: that is `width < 72rem`, so at exactly 72rem the CSS and the script would disagree.
 */

/**
 * The page. `--header-height` is for blocks that fill the rest of the first screen; `--section-inline` is the
 * side padding of every section below the hero: the same centred 9-of-12 column as the hero (48 px in, then
 * 1/8 of what is left on each side). Other sections (who-it-helps, demo) read both.
 *
 * On <html> while this page is shown: anything scrolled to (a section, a focused link) stops below the pinned
 * header, never under it (WCAG 2.4.11 Focus Not Obscured), and section links glide to their section unless
 * the visitor asked for less motion.
 */
export const pageClass =
  '[--header-height:calc(var(--target-min)_+_2*var(--space-4)_+_1px)] [--section-inline:calc(var(--space-8)_+_(100%_-_2*var(--space-8))_/_8)] min-h-dvh grid content-start bg-bg [html:has(&)]:scroll-pt-[calc(var(--target-min)_+_2*var(--space-4)_+_1px)] motion-safe:[html:has(&)]:scroll-smooth';

/** Skip link: hidden until focused, then above the header. */
export const skipClass =
  'absolute -top-25 left-12 z-2 py-3 px-4 rounded-sm bg-surface text-accent font-semibold focus:top-2';

/** Section heading type. */
const titleType = 'leading-tight font-extrabold tracking-[-0.02em]';

/** A section title. */
export const titleClass = `m-0 text-3xl ${titleType}`;

/** Big section heading (Prototyp, Nowości, Technologia): twice the other titles, in the accent colour. */
export const sectionHeadingClass = `text-accent text-[length:calc(2*var(--font-3xl))] ${titleType}`;

/** The lead paragraph under a section title. */
export const leadClass = 'm-0 text-text-muted text-lg';

/** Outline icons in a tile (hero highlights, what is new). */
export const strokeIconClass =
  'fill-none stroke-current stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]';

/** Technical-drawing grid behind the hero and the prototype section: fine lines every 24 px, stronger ones
    every 96 px. Ink colour at 2.5% and 5%, so it works in both themes. */
export const drawingGridClass =
  '[--grid-minor:color-mix(in_srgb,var(--text)_2.5%,transparent)] [--grid-major:color-mix(in_srgb,var(--text)_5%,transparent)] [background-image:linear-gradient(to_right,var(--grid-major)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-major)_1px,transparent_1px),linear-gradient(to_right,var(--grid-minor)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-minor)_1px,transparent_1px)] [background-size:96px_96px,96px_96px,24px_24px,24px_24px] [background-position:center_top]';
