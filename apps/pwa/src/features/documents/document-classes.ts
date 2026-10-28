/*
 * Class lists shared by the document card, the document screen and the views built like them (category
 * tiles, the bought ticket, the ZUS booking). Tailwind utilities from our tokens
 * (docs/decisions/tailwind-2026-10-28.md).
 */

/** Line icons inside the element: no fill, the text colour, round ends. */
export const lineIconsClass =
  '[&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]';

/**
 * Card frame: white surface, dark text, border in the icon tile's light grey (user choices 2026-10-26).
 * No gradients, guilloches, holograms, flags or emblems (prototype-guardrails skill). Each user adds its
 * size, padding and overflow.
 */
export const cardClass =
  'relative flex flex-col gap-3 rounded-lg border-2 border-(color:--card-tint) bg-surface text-text no-underline [--card-tint:color-mix(in_srgb,var(--text)_8%,transparent)]';

/** The card's icon tile, in the border's grey. */
export const cardIconClass = `grid size-11 flex-none place-items-center rounded-md bg-(--card-tint) ${lineIconsClass}`;

/** The card's name; each user adds its size. */
export const cardTitleClass = 'font-bold leading-tight';

/**
 * A document-like view. "PROTOTYP – nie jest dokumentem" across the whole of it, from data-watermark.
 * Decorative, so it is generated content.
 */
export const documentClass =
  'relative grid gap-4 overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:grid after:-rotate-24 after:place-items-center after:text-center after:text-2xl after:font-extrabold after:text-watermark after:uppercase after:content-[attr(data-watermark)]';

/** The details panel inside a document view. */
export const detailsClass = 'rounded-lg border border-border bg-surface p-4 [&_dl]:m-0 [&_h2]:text-lg';

/** One label–value row of a details list (`<div><dt/><dd/></div>`). */
export const detailRowClass =
  'flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border py-3 [&_dd]:m-0 [&_dd]:font-semibold [&_dd]:wrap-anywhere [&_dt]:text-text-muted';
