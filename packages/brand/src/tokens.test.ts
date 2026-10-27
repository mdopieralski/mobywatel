import { describe, expect, it } from 'vitest';

import { contrastRatio } from './contrast.ts';
import { themeCss } from './css.ts';
import { COLORS, CONTRAST_PAIRS, type ThemeName } from './tokens.ts';
import { TAGLINES, UNOFFICIAL_DISCLAIMER, UNOFFICIAL_DISCLAIMERS, WORKING_NAME } from './copy.ts';
import { LOCALE_NAMES, LOCALES } from './locales.ts';

describe('contrast', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 1);
  });

  for (const theme of Object.keys(COLORS) as ThemeName[]) {
    for (const [fg, bg, min] of CONTRAST_PAIRS) {
      it(`${theme}: ${fg} on ${bg} ≥ ${min}:1`, () => {
        expect(contrastRatio(COLORS[theme][fg], COLORS[theme][bg])).toBeGreaterThanOrEqual(min);
      });
    }
  }
});

describe('themeCss', () => {
  it('defines semantic colours, dark, senior and reduced-motion blocks', () => {
    const css = themeCss();
    expect(css).toContain('--accent-text:');
    expect(css).toContain(":root[data-theme='dark']");
    expect(css).toContain(":root[data-senior='true']");
    expect(css).toContain('--target-min: 56px');
    expect(css).toContain('prefers-reduced-motion');
  });
});

describe('copy guardrails', () => {
  it('disclaimer says unofficial and fictional', () => {
    expect(UNOFFICIAL_DISCLAIMER).toMatch(/nieoficjalny prototyp/i);
    expect(UNOFFICIAL_DISCLAIMER).toMatch(/fikcyjne/);
  });
  it('working name is not the mObywatel name', () => {
    expect(WORKING_NAME.toLowerCase()).not.toContain('obywatel');
  });
});

describe('locales', () => {
  it('every locale has a name, a tagline and a full disclaimer', () => {
    for (const locale of LOCALES) {
      expect(LOCALE_NAMES[locale]).toBeTruthy();
      expect(TAGLINES[locale]).toBeTruthy();
      // The meaning must survive: the challenge and the app it is not are named in every language.
      expect(UNOFFICIAL_DISCLAIMERS[locale]).toContain('mobywatel.ai');
      expect(UNOFFICIAL_DISCLAIMERS[locale]).toContain('mObywatel');
    }
    expect(UNOFFICIAL_DISCLAIMERS.pl).toBe(UNOFFICIAL_DISCLAIMER);
  });
});
