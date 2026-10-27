import { type CSSProperties, useState } from 'react';

/**
 * The boot loader in index.html: how long it stays, then how long it fades. The build writes these into
 * index.html (vite.config.ts).
 */
export const BOOT_LOADER = { holdMs: 1500, fadeMs: 1000 } as const;

/** Time from navigation start until the loader is fully gone. */
export const BOOT_LOADER_END_MS = BOOT_LOADER.holdMs + BOOT_LOADER.fadeMs;

/**
 * The header's entrance once the loader is gone: the icon draws its tick, then the name appears, then the
 * nav items one by one. Times are from navigation start.
 */
const TICK_MS = 600;
const REVEAL_MS = 900;
const NAV_STEP_MS = 180;

export const INTRO = {
  tickMs: TICK_MS,
  revealMs: REVEAL_MS,
  navStepMs: NAV_STEP_MS,
  tickAt: BOOT_LOADER_END_MS,
  nameAt: BOOT_LOADER_END_MS + TICK_MS,
  /** Nav starts while the name is still fading in, so the two blend. */
  navAt: BOOT_LOADER_END_MS + TICK_MS + REVEAL_MS / 2,
  /** Showcase hero: starts with the header (as the loader goes), one part every heroStepMs. */
  heroAt: BOOT_LOADER_END_MS,
  heroStepMs: 200,
} as const;

/**
 * How long until `atMs` after navigation start, for `introStyle`. Fixed at first render, so re-renders and
 * route changes never replay the entrance; 0 once that moment has passed.
 */
export function useIntroDelay(atMs: number): number {
  const [delay] = useState(() => Math.max(0, Math.round(atMs - performance.now())));
  return delay;
}

/** Sets `--intro-delay` (read by intro.module.css and app-mark.module.css). */
export function introStyle(delayMs: number): CSSProperties {
  return { '--intro-delay': `${delayMs}ms` } as CSSProperties;
}

/**
 * Ends the entrance for good: everything shows in its final state (intro.module.css, app-mark.module.css).
 * Called on the first key press or click, so a keyboard user never tabs onto something still invisible,
 * and at once inside the phone frames, which have no loader to wait for.
 */
export function endIntro(): void {
  document.documentElement.dataset.introDone = '';
}

/** Ends the entrance on the first key press or pointer press. */
export function endIntroOnInput(): void {
  const end = () => {
    endIntro();
    document.removeEventListener('keydown', end, true);
    document.removeEventListener('pointerdown', end, true);
  };
  document.addEventListener('keydown', end, true);
  document.addEventListener('pointerdown', end, true);
}
