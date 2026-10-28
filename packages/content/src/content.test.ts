import { isValidPesel } from '@mobywatel/core';
import { describe, expect, it } from 'vitest';

import { PERSONAS } from './index.ts';

// Guardrails: fictional and obviously so (prototype-guardrails skill).
describe.each(PERSONAS)('persona $id', (persona) => {
  it('has a valid fictional PESEL and PRO-style numbers only', () => {
    expect(isValidPesel(persona.pesel)).toBe(true);
    for (const doc of persona.documents) {
      for (const [key, value] of doc.fields) {
        if ((key === 'documentNumber' || key === 'cardNumber' || key === 'plate') && 'text' in value) {
          expect(value.text, `${doc.kind} ${key}`).toMatch(/PRO/);
        }
      }
    }
  });

  it('has one card per document kind and ISO dates', () => {
    const kinds = persona.documents.map((d) => d.kind);
    expect(new Set(kinds).size).toBe(kinds.length);
    for (const doc of persona.documents) {
      for (const [, value] of doc.fields) {
        if ('date' in value) {
          expect(value.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      }
    }
  });
});

describe('categories', () => {
  it('put every document of every persona in exactly one category', async () => {
    const { CATEGORIES } = await import('./index.ts');
    for (const persona of PERSONAS) {
      for (const doc of persona.documents) {
        expect(
          CATEGORIES.filter((c) => c.documents.includes(doc.kind)),
          doc.kind
        ).toHaveLength(1);
      }
    }
  });

  it('list every matter in at most one category, once', async () => {
    const { CATEGORIES } = await import('./index.ts');
    const all = CATEGORIES.flatMap((c) => c.matters);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('tickets', () => {
  it('has four tickets with unique ids and positive whole-grosz prices', async () => {
    const { TICKETS } = await import('./index.ts');
    expect(TICKETS).toHaveLength(4);
    expect(new Set(TICKETS.map((t) => t.id)).size).toBe(4);
    for (const ticket of TICKETS) {
      expect(Number.isInteger(ticket.priceGrosz), ticket.id).toBe(true);
      expect(ticket.priceGrosz, ticket.id).toBeGreaterThan(0);
    }
  });
});

describe('ZUS offices and slots', () => {
  it('has 6 to 8 offices with unique ids', async () => {
    const { ZUS_OFFICES } = await import('./index.ts');
    expect(ZUS_OFFICES.length).toBeGreaterThanOrEqual(6);
    expect(ZUS_OFFICES.length).toBeLessThanOrEqual(8);
    expect(new Set(ZUS_OFFICES.map((o) => o.id)).size).toBe(ZUS_OFFICES.length);
  });

  it('offers three slots on each of 8 working days, never at a weekend or on a holiday', async () => {
    const { zusSlots } = await import('./index.ts');
    // Wednesday 28.10.2026. Working days after it: 29, 30.10, 2 (the 3rd), 3, 4, 5, 6, 9, 10, 12.11 (the
    // 10th); 11.11 is a holiday.
    const slots = zusSlots(new Date(2026, 9, 28, 15, 0));
    expect(slots).toHaveLength(24);
    expect(slots[0]?.dateIso).toBe('2026-11-02');
    expect(slots.at(-1)?.dateIso).toBe('2026-11-12');
    expect(slots.some((s) => s.dateIso === '2026-11-11')).toBe(false);
    expect(new Set(slots.map((s) => s.id)).size).toBe(24);
    for (const slot of slots) {
      const [y, m, d] = slot.dateIso.split('-').map(Number);
      const day = new Date(y ?? 0, (m ?? 1) - 1, d).getDay();
      expect(day === 0 || day === 6, slot.dateIso).toBe(false);
    }
  });
});
