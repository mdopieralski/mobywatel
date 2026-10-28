// @mobywatel/content: fictional personas, scenario scripts and service knowledge (plain Polish).
import type { Persona } from '@mobywatel/core';

import { KATARZYNA } from './personas/katarzyna.ts';

export const PERSONAS: readonly Persona[] = [KATARZYNA];

/** The persona a juror sees first. */
export const DEFAULT_PERSONA: Persona = KATARZYNA;

export { CATEGORIES, type Category, type CategoryId, type MatterId } from './categories.ts';
export { TARIFF_CHECKED_ON, type TicketId, TICKETS, type TicketType, ticketById } from './tickets.ts';
export { ZUS_OFFICES, type ZusOffice, type ZusSlot, zusOfficeById, zusSlots } from './zus-offices.ts';
