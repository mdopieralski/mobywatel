/*
 * Class lists shared by the category screen and the matter screen (docs/decisions/tailwind-2026-10-28.md).
 */
import { lineIconsClass } from '../documents/document-classes.ts';

/**
 * The screen's column. Headings and paragraphs inside, also in a matter's flow, lose their default margins.
 * A confirm card's heading keeps a step below it, as it did with the CSS module.
 */
export const screenClass =
  'grid grid-cols-[minmax(0,1fr)] gap-4 [&_[data-confirm-card]>h2]:mb-3 [&_h1]:m-0 [&_p]:m-0';

/** Section headings on the screen. */
export const sectionHeadingClass = 'text-lg';

export const backLinkClass = 'inline-flex min-h-target items-center gap-2 justify-self-start font-semibold';

export const headingClass = 'flex items-center gap-3 wrap-anywhere';

const iconTileClass = `grid flex-none place-items-center rounded-md bg-(--card-color) text-card-text ${lineIconsClass}`;

/** The category's icon next to its name. */
export const iconClass = `size-12 ${iconTileClass}`;

/** A smaller icon tile: in a row, and next to a matter's name. */
export const rowIconClass = `size-11 ${iconTileClass}`;

export const descriptionClass = 'text-lg text-text-muted';

/** A long word (German, senior text) wraps instead of widening the column past the screen. */
export const listClass = 'm-0 grid list-none grid-cols-[minmax(0,1fr)] gap-3 p-0';

export const rowClass =
  'flex min-h-target items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-text no-underline';

export const rowTextClass =
  'flex min-w-0 flex-1 flex-col wrap-anywhere hyphens-auto [&_span]:text-sm [&_span]:text-text-muted';

export const chevronClass =
  'flex-none fill-none stroke-current stroke-2 text-text-muted [stroke-linecap:round] [stroke-linejoin:round]';

export const soonClass = 'text-text-muted';

export const badgeClass =
  'justify-self-start rounded-pill bg-accent-soft px-3 py-1 text-sm font-semibold text-accent';
