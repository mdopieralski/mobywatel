/* Wizyta w ZUS: the same panels and big option buttons as the city picker (../travel/picker-classes.ts). */
import { panelClass } from '../travel/picker-classes.ts';

/** A step's panel. Its headings take focus when the step opens, without a ring around them. */
export const zusPanelClass = `${panelClass} [&_dl]:m-0 [&_h2:focus]:outline-none [&_h3:focus]:outline-none`;

export const noteClass = 'm-0 text-text-muted';

export const hintClass = 'm-0 text-sm text-text-muted';
