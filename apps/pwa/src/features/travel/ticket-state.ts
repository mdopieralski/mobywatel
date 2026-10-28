import { type TicketId, ticketById } from '@mobywatel/content';

import { DEMO_PREFIX } from '../../platform/demo-state.ts';

/** "28.10, 14:05": day and time for when it was bought and until when it is valid. */
export const TIME_FORMAT = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' } as const;

/** The bought ticket: demo state, so "Zresetuj demo" clears it. It survives a reload. */
export const TICKET_KEY = `${DEMO_PREFIX}ticket`;

export interface BoughtTicket {
  cityId: string;
  ticketId: TicketId;
  boughtAtIso: string;
}

export function readTicket(): BoughtTicket | null {
  try {
    const raw = localStorage.getItem(TICKET_KEY);
    const value = raw ? (JSON.parse(raw) as Partial<BoughtTicket>) : null;
    if (
      value &&
      typeof value.cityId === 'string' &&
      ticketById(value.ticketId) &&
      typeof value.boughtAtIso === 'string' &&
      !Number.isNaN(Date.parse(value.boughtAtIso))
    ) {
      return value as BoughtTicket;
    }
  } catch {
    // storage blocked or broken JSON: no ticket
  }
  return null;
}

export function saveTicket(ticket: BoughtTicket): void {
  try {
    localStorage.setItem(TICKET_KEY, JSON.stringify(ticket));
  } catch {
    // storage blocked: the ticket lasts until the page closes
  }
}

/** When a time ticket stops being valid; null for a single-ride ticket. */
export function validUntil(ticket: BoughtTicket): Date | null {
  const minutes = ticketById(ticket.ticketId)?.minutes;
  return minutes == null ? null : new Date(Date.parse(ticket.boughtAtIso) + minutes * 60_000);
}
