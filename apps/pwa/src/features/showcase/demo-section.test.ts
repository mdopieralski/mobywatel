import { LOCALES } from '@mobywatel/brand';
import { DEMO_CHAPTERS, DEMO_CUES, DEMO_DURATION, DEMO_PROPOSALS } from '@mobywatel/content/demo-video';
import { matchRoutes } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from '../../app/router.tsx';
import { DEMO_TRY } from './demo.ts';

describe('demo video timeline', () => {
  it('has chapters in order, inside the video', () => {
    let last = 0;
    for (const c of DEMO_CHAPTERS) {
      expect(c.from).toBeGreaterThanOrEqual(last);
      expect(c.to).toBeGreaterThan(c.from);
      last = c.to;
    }
    expect(last).toBeLessThanOrEqual(DEMO_DURATION);
  });

  it.each(LOCALES)(
    '%s: each caption stays at least 3 s and reads slowly enough, never overlapping',
    async (locale) => {
      const { demo } = (await import(`../../../messages/${locale}/showcase.json`)).default;
      // Characters a second: about 15 in Polish (seniors read every caption twice); the other languages run
      // up to a third longer for the same idea.
      const limit = locale === 'pl' ? 15.5 : 17;
      let end = 0;
      for (const c of DEMO_CUES) {
        expect(c.from, c.key).toBeGreaterThanOrEqual(end);
        const seconds = c.to - c.from;
        expect(seconds, c.key).toBeGreaterThanOrEqual(3);
        expect(demo.cues[c.key].length / seconds, c.key).toBeLessThanOrEqual(limit);
        end = c.to;
      }
      expect(end).toBeLessThanOrEqual(DEMO_DURATION);
    }
  );

  it('marks proposals only inside the ZUS and ticket chapters', () => {
    for (const p of DEMO_PROPOSALS) {
      const chapter = DEMO_CHAPTERS.find((c) => p.from >= c.from && p.to <= c.to);
      expect(['zus', 'tickets']).toContain(chapter?.id);
    }
  });

  it.each(Object.entries(DEMO_TRY))('%s opens a screen that exists (%s)', (_id, to) => {
    const leaf = matchRoutes(routes, to)?.at(-1)?.route;
    expect(leaf).toBeDefined();
    expect(leaf?.path).not.toBe('*');
  });
});
