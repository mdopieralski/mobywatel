// The categories on the start screen, in the order the user set (2026-10-25). Which documents and
// reminders belong where is service knowledge, so it lives here, not in the UI.
import type { DocumentKind, ReminderKind } from '@mobywatel/core';

export type CategoryId =
  | 'security'
  | 'vehicles'
  | 'taxes'
  | 'zus'
  | 'studentCards'
  | 'travel'
  | 'licences'
  | 'health'
  | 'business'
  | 'payments'
  | 'family'
  | 'elections'
  | 'environment'
  | 'other';

/** A matter inside a category (its submenu). None is built yet: each opens a "Wkrótce" screen. */
export type MatterId =
  | 'blockPesel'
  | 'blockDocument'
  | 'safeOnline'
  | 'checkId'
  | 'checkPesel'
  | 'defenceTraining'
  | 'safetyGuide'
  | 'collision'
  | 'checkInsurance'
  | 'penaltyPoints'
  | 'driverLicence'
  | 'vehicleHistory'
  | 'fines'
  | 'travelAbroad'
  | 'safeBus'
  | 'trainTickets'
  | 'cityCard'
  | 'cityTicket';

export interface Category {
  id: CategoryId;
  documents: readonly DocumentKind[];
  reminders: readonly ReminderKind[];
  /** The submenu, in the order the user set (2026-10-26). */
  matters: readonly MatterId[];
}

export const CATEGORIES: readonly Category[] = [
  {
    id: 'security',
    documents: ['id-card'],
    reminders: [],
    matters: [
      'blockPesel',
      'blockDocument',
      'safeOnline',
      'checkId',
      'checkPesel',
      'defenceTraining',
      'safetyGuide',
    ],
  },
  {
    id: 'vehicles',
    documents: ['vehicle'],
    reminders: ['insurance-ends'],
    // In the order the user set (2026-10-26).
    matters: ['collision', 'checkInsurance', 'penaltyPoints', 'driverLicence', 'vehicleHistory', 'fines'],
  },
  { id: 'taxes', documents: [], reminders: ['tax-letter', 'property-tax'], matters: [] },
  { id: 'zus', documents: [], reminders: [], matters: [] },
  { id: 'studentCards', documents: [], reminders: [], matters: [] },
  {
    id: 'travel',
    documents: [],
    reminders: [],
    // In the order the user set (2026-10-26).
    matters: ['travelAbroad', 'safeBus', 'trainTickets', 'cityCard', 'cityTicket'],
  },
  { id: 'licences', documents: ['driving-licence'], reminders: [], matters: [] },
  { id: 'health', documents: [], reminders: [], matters: [] },
  { id: 'business', documents: [], reminders: [], matters: [] },
  { id: 'payments', documents: [], reminders: ['property-tax'], matters: [] },
  { id: 'family', documents: ['family-card'], reminders: [], matters: [] },
  { id: 'elections', documents: [], reminders: [], matters: [] },
  { id: 'environment', documents: [], reminders: [], matters: [] },
  { id: 'other', documents: [], reminders: [], matters: [] },
];
