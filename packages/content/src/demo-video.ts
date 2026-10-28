// The demo video's timeline ("Jeden dzień z aplikacją", docs/product/demo-video.md). One source for both sides:
// apps/video draws the scenes at these times, and the landing page (apps/pwa showcase) builds its chapter
// buttons and its captions in the visitor's language from the same numbers. Times are in seconds.

export const DEMO_FPS = 30;

/** Length of the whole video. */
export const DEMO_DURATION = 80;

export type DemoChapterId = 'zus' | 'tickets' | 'languages';

export interface DemoChapter {
  id: DemoChapterId;
  /** From the chapter's title card to the start of the next chapter. */
  from: number;
  to: number;
}

export const DEMO_CHAPTERS: readonly DemoChapter[] = [
  { id: 'zus', from: 6, to: 30 },
  { id: 'tickets', from: 30, to: 51 },
  { id: 'languages', from: 51, to: 71 },
];

/**
 * Captions. `key` points at showcase.demo.cues.<key> in apps/pwa/messages/<locale>/showcase.json. Each stays
 * at least 3 s and needs at most about 15 characters a second in Polish (17 in
 * the other languages, which run longer; demo-section.test.ts checks all 8) (plain-language rules for the video).
 */
export type DemoCueKey =
  | 'intro'
  | `zus${1 | 2 | 3 | 4 | 5 | 6}`
  | `tickets${1 | 2 | 3 | 4 | 5}`
  | `languages${1 | 2 | 3 | 4}`
  | `outro${1 | 2}`;

export const DEMO_CUES: readonly { key: DemoCueKey; from: number; to: number }[] = [
  { key: 'intro', from: 0.5, to: 5.5 },
  { key: 'zus1', from: 9, to: 13 },
  { key: 'zus2', from: 13, to: 17 },
  { key: 'zus3', from: 17, to: 20.5 },
  { key: 'zus4', from: 20.5, to: 24 },
  { key: 'zus5', from: 24, to: 27 },
  { key: 'zus6', from: 27, to: 30 },
  { key: 'tickets1', from: 32.6, to: 36.5 },
  { key: 'tickets2', from: 36.5, to: 41 },
  { key: 'tickets3', from: 41, to: 44.5 },
  { key: 'tickets4', from: 44.5, to: 48.5 },
  // Runs 0.5 s into the next title card, so it gets its 3 s.
  { key: 'tickets5', from: 48.5, to: 51.5 },
  { key: 'languages1', from: 54, to: 58 },
  { key: 'languages2', from: 58, to: 62 },
  { key: 'languages3', from: 62, to: 65.5 },
  { key: 'languages4', from: 65.5, to: 71 },
  { key: 'outro1', from: 71.5, to: 75.5 },
  { key: 'outro2', from: 75.5, to: 80 },
];

/** Planned, not built: these stretches carry the "Propozycja" badge in the video. */
export const DEMO_PROPOSALS: readonly { from: number; to: number }[] = [
  { from: 20.5, to: 30 },
  { from: 41, to: 51 },
];
