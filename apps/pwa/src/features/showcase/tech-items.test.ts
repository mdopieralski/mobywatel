import { describe, expect, it } from 'vitest';

import pl from '../../../messages/pl/showcase.json' with { type: 'json' };
import { TECH_ITEMS } from './tech-items.ts';

describe('TECH_ITEMS', () => {
  it('lists exactly the points in the Polish copy, in order', () => {
    const items = (pl as unknown as { tech: { items: Record<string, string> } }).tech.items;
    expect(TECH_ITEMS).toEqual(Object.keys(items));
  });
});
