import type { RelativeDate } from './dates.ts';
import type { Sex } from './pesel.ts';

// Shapes for FICTIONAL demo personas. Which personas and matters we cover is a product decision
// (product-manager); data lives in @mobywatel/content. Labels are message keys, not text, so every UI
// language can show them (apps/pwa/messages/<locale>/documents.json).

export type DocumentKind = 'id-card' | 'driving-licence' | 'family-card' | 'vehicle';

export type FieldKey =
  | 'firstName'
  | 'lastName'
  | 'pesel'
  | 'birthDate'
  | 'documentNumber'
  | 'validUntil'
  | 'categories'
  | 'penaltyPoints'
  | 'cardNumber'
  | 'model'
  | 'plate'
  | 'insuranceUntil'
  | 'inspectionUntil';

/** A value is shown as is (`text`) or formatted for the UI language (`date`, ISO yyyy-mm-dd). */
export type FieldValue = { text: string } | { date: string };

export interface PersonaDocument {
  kind: DocumentKind;
  /** Date the wallet card shows as its status: valid until, or OC until for a vehicle. Absent = no end. */
  statusDate?: string;
  fields: ReadonlyArray<readonly [FieldKey, FieldValue]>;
}

export type ReminderKind = 'tax-letter' | 'insurance-ends' | 'property-tax';

export interface Reminder {
  id: string;
  kind: ReminderKind;
  due: RelativeDate;
  urgent?: boolean;
}

export interface Persona {
  /** URL id, e.g. ?osoba=<id>. */
  id: string;
  firstName: string;
  lastName: string;
  sex: Sex;
  /** One line for the persona switcher, e.g. "Lublin, 58 lat, opiekuje się mamą". */
  summary: string;
  pesel: string;
  documents: readonly PersonaDocument[];
  reminders: readonly Reminder[];
}
