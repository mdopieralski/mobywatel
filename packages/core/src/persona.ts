import type { RelativeDate } from './dates.ts';

// Shapes for FICTIONAL demo personas. Which personas and matters we cover is a product decision
// (product-manager); data lives in @mobywatel/content.

export type DocumentKind = 'id-card' | 'driving-licence' | 'vehicle' | 'family-card' | 'student-card';

export interface PersonaDocument {
  kind: DocumentKind;
  /** Display rows, already in plain Polish, e.g. ['Ważny do', '20.05.2031']. */
  rows: ReadonlyArray<readonly [label: string, value: string]>;
  validUntil?: RelativeDate;
}

export interface Reminder {
  id: string;
  title: string;
  due: RelativeDate;
  /** Matter that resolves it, e.g. 'id-renewal'. */
  matter?: string;
}

export interface Persona {
  /** URL id, e.g. ?osoba=<id>. */
  id: string;
  firstName: string;
  lastName: string;
  /** One line for the persona switcher, e.g. "Lublin, 58 lat, opiekuje się mamą". */
  summary: string;
  pesel: string;
  documents: readonly PersonaDocument[];
  reminders: readonly Reminder[];
}
