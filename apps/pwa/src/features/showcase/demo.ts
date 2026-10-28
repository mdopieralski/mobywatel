import type { DemoChapterId } from '@mobywatel/content/demo-video';

import { PATHS } from '../../app/paths.ts';
import { matterPath } from './audience.ts';

/**
 * Rendered from apps/video (`pnpm run render:demo`). The version is part of the name, so the files can be
 * cached forever: a new render gets a new name here and in apps/video/scripts/render.mjs.
 */
export const DEMO_VIDEO = { src: '/video/demo-v1.mp4', poster: '/video/demo-v1-poster.jpg' } as const;

/** What each chapter's "try it" link opens in the phone above. */
export const DEMO_TRY: Record<DemoChapterId, string> = {
  zus: `${PATHS.categories}/zus`,
  tickets: matterPath('travel', 'cityTicket'),
  languages: PATHS.start,
};
