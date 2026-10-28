/*
 * Panels and big option buttons: the city picker and tickets (Bilet miejski), and the same look in Wizyta w
 * ZUS. Tailwind utilities from our tokens (docs/decisions/tailwind-2026-10-28.md).
 */

/** A step of a flow, and the bought ticket's wrapper. */
export const flowClass = 'grid gap-4';

/** A bordered panel; its headings and paragraphs have no margins (the grid gap spaces them). */
export const panelClass = 'grid gap-3 rounded-lg border border-border bg-surface p-4 [&_h2]:m-0 [&_p]:m-0';

/** A panel's heading. */
export const panelTitleClass = 'text-lg';

export const labelClass = 'font-bold';

/** Notes and the town's voivodeship. */
export const mutedClass = 'text-text-muted';

/** Hints and the live result count. */
export const hintClass = 'text-sm text-text-muted';

/**
 * A form control's font from the page instead of the browser's control font (what `font: inherit` did).
 * Size and weight are set by each control, so they never fight a later utility.
 */
const inheritFontClass = '[font-family:inherit] [font-style:inherit] leading-[inherit]';

/** The search field. At least 16 px text, so iOS does not zoom in when the field gets focus. */
export const inputClass = `min-h-target rounded-md border-2 border-border-strong bg-bg px-4 py-0 text-md text-text ${inheritFontClass} [font-weight:inherit]`;

export const optionListClass = 'm-0 grid list-none gap-2 p-0';

/** A big option button, without its width and alignment (an option fills the row, a time does not). */
const optionBaseClass = `flex min-h-target cursor-pointer flex-wrap items-baseline gap-x-3 gap-y-0 rounded-md border border-border bg-bg px-4 py-2 text-left text-text ${inheritFontClass} [font-size:inherit] [&:hover]:border-(--card-color,var(--accent))`;

/** A town, a ticket or an office: name on the left, details on the right or below. */
export const optionClass = `${optionBaseClass} w-full justify-between [font-weight:inherit]`;

/** A free time at a ZUS office: several side by side, wrapping on a narrow screen or with large text. */
export const timeOptionClass = `${optionBaseClass} w-auto min-w-24 justify-center font-semibold`;

export const optionNameClass = 'font-semibold wrap-anywhere';

export const optionMetaClass = 'text-sm text-text-muted';

/** The outlined pill: "Zmień miasto", "Zmień placówkę", "Umów inną wizytę". */
export const changeButtonClass = `min-h-target cursor-pointer justify-self-start rounded-pill border-2 border-text bg-transparent px-5 py-0 font-bold text-text ${inheritFontClass} [font-size:inherit]`;
