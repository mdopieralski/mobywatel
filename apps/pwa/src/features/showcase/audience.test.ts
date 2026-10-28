import { matchRoutes } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from '../../app/router.tsx';
import { categoryBySlug, MATTERS } from '../categories/categories.tsx';
import { AUDIENCE } from './audience.ts';

describe('AUDIENCE ("Dla kogo")', () => {
  it('has unique ids', () => {
    const ids = AUDIENCE.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(AUDIENCE.filter((m) => m.to).map((m) => [m.id, m.to as string]))(
    '%s opens a screen that exists (%s)',
    (_id, to) => {
      const leaf = matchRoutes(routes, to)?.at(-1)?.route;
      expect(leaf).toBeDefined();
      expect(leaf?.path).not.toBe('*');
      // A matter path: both slugs must be real, or the screen would be "not found".
      const [, , , category, matter] = to.split('/');
      if (category) {
        const view = categoryBySlug(category);
        expect(view).toBeDefined();
        if (matter) {
          expect(Object.values(MATTERS).some((m) => m.slug === matter)).toBe(true);
        }
      }
    }
  );
});
