import { zusOfficeById } from '@mobywatel/content';

import { DEMO_PREFIX } from '../../platform/demo-state.ts';

/** "poniedziałek, 2 listopada". */
export const DAY_FORMAT = { weekday: 'long', day: 'numeric', month: 'long' } as const;

/** The booked visit: demo state, so "Zresetuj demo" clears it. It survives a reload. */
export const ZUS_VISIT_KEY = `${DEMO_PREFIX}zus-visit`;

export interface ZusBooking {
  officeId: string;
  /** YYYY-MM-DD, local. */
  dateIso: string;
  /** HH:MM, local. */
  time: string;
  /** Obviously fictional, e.g. PROTO-ZUS-4821. */
  reference: string;
}

export function readBooking(): ZusBooking | null {
  try {
    const raw = localStorage.getItem(ZUS_VISIT_KEY);
    const value = raw ? (JSON.parse(raw) as Partial<ZusBooking>) : null;
    if (
      value &&
      zusOfficeById(value.officeId) &&
      typeof value.dateIso === 'string' &&
      typeof value.time === 'string' &&
      typeof value.reference === 'string'
    ) {
      return value as ZusBooking;
    }
  } catch {
    // storage blocked or broken JSON: no booking
  }
  return null;
}

export function saveBooking(booking: ZusBooking): void {
  try {
    localStorage.setItem(ZUS_VISIT_KEY, JSON.stringify(booking));
  } catch {
    // storage blocked: the booking lasts until the page closes
  }
}

export function clearBooking(): void {
  try {
    localStorage.removeItem(ZUS_VISIT_KEY);
  } catch {
    // storage blocked: nothing persisted to clear
  }
}

/** PROTO-ZUS- and four digits: never mistaken for a real reference number. */
export function fictionalReference(now: number = Date.now()): string {
  return `PROTO-ZUS-${String(now % 10_000).padStart(4, '0')}`;
}
