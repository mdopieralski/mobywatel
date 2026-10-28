// The video's look comes straight from @mobywatel/brand, as TS values (not CSS variables), so the page
// theme can't recolour it and every render matches. Light theme only.
import { COLORS, FONT_FAMILY, RADIUS, SPACE } from '@mobywatel/brand';
import { DEMO_FPS } from '@mobywatel/content/demo-video';
import { Easing, interpolate } from 'remotion';

import '@fontsource-variable/inter-tight';

export const C = COLORS.light;
export { RADIUS, SPACE };

/** Bundled, so a render looks the same on every machine. The app screens keep the app's system stack. */
export const VIDEO_FONT = `'Inter Tight Variable', ${FONT_FAMILY}`;
export const APP_FONT = FONT_FAMILY;

export const FPS = DEMO_FPS;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Seconds → frames. */
export const f = (seconds: number) => Math.round(seconds * FPS);

/** The brand's standard easing (cubic-bezier(0.2, 0, 0, 1)); motion is calm, no bounce. */
export const EASE = Easing.bezier(0.2, 0, 0, 1);

/** 0 → 1 between two times (seconds), eased and clamped. */
export function progress(t: number, from: number, to: number): number {
  return interpolate(t, [from, to], [0, 1], {
    easing: EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/** One hue per chapter, never close to an institution's or a carrier's colour (no ZUS green). */
export const CHAPTER_HUE = {
  zus: C.cardTeal,
  tickets: C.cardBlue,
  languages: C.cardPlum,
} as const;
