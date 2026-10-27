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
