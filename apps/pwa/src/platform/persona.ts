// The persona the demo shows and "today". One persona for now; switching comes with the product-manager's
// persona set (packages/content).
import { DEFAULT_PERSONA } from '@mobywatel/content';
import type { Persona } from '@mobywatel/core';
import { useState } from 'react';

export function usePersona(): Persona {
  return DEFAULT_PERSONA;
}

/** Today at the app edge (core never calls new Date()). Fixed for the life of the screen. */
export function useToday(): Date {
  const [today] = useState(() => new Date());
  return today;
}

/** ISO yyyy-mm-dd as a local calendar date (no time-zone shift). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}
