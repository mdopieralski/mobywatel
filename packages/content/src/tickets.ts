// Bilet miejski: one generic tariff for every town. Prices are invented and look it (1,11 zł, 2,22 zł…):
// fictional data only (prototype-guardrails skill). Per-city tariffs are out of scope.

export type TicketId = 'single' | 'time20' | 'time75' | 'daily';

export interface TicketType {
  id: TicketId;
  /** How long it is valid after buying; null = one ride, any length. */
  minutes: number | null;
  /** Money in grosze, as an integer. Never floats. */
  priceGrosz: number;
}

export const TICKETS: readonly TicketType[] = [
  { id: 'single', minutes: null, priceGrosz: 111 },
  { id: 'time20', minutes: 20, priceGrosz: 222 },
  { id: 'time75', minutes: 75, priceGrosz: 333 },
  { id: 'daily', minutes: 24 * 60, priceGrosz: 999 },
];

/** When the made-up tariff was last "checked": the date on the confirm card's source line. */
export const TARIFF_CHECKED_ON = '2026-10-28';

export function ticketById(id: string | null | undefined): TicketType | undefined {
  return TICKETS.find((t) => t.id === id);
}
