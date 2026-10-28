import type { CategoryId, MatterId } from '@mobywatel/content';

import { PATHS } from '../../app/paths.ts';
import { CATEGORY_VIEWS, MATTERS } from '../categories/categories.tsx';

/**
 * "Dla kogo": fictional example people (docs/product/who-it-helps.md). Each one stands for a group the
 * prototype already serves, with one thing to try. They are not app personas: the app always shows Katarzyna,
 * so a button names the screen it opens, never "see it as Teresa".
 */
export type AudienceId = 'senior' | 'screenReader' | 'languages' | 'offline' | 'noLogin' | 'cityTicket';

export type AudienceMember = {
  id: AudienceId;
  /** The screen the "Pokaż …" button opens in the phone. None: there is nothing to show (offline). */
  to?: string;
  /** Part of what helps them is not built yet: the card shows the "Wkrótce" badge. */
  soon?: true;
};

function matterPath(category: CategoryId, matter: MatterId): string {
  const categorySlug = CATEGORY_VIEWS.find((c) => c.id === category)?.slug;
  return `${PATHS.categories}/${categorySlug}/${MATTERS[matter].slug}`;
}

/** In the order of the plan: what a juror should see first. */
export const AUDIENCE: readonly AudienceMember[] = [
  { id: 'senior', to: PATHS.settings },
  { id: 'screenReader', to: PATHS.settings },
  // The language switch is in the app header on every screen; the start screen is where to find it.
  { id: 'languages', to: PATHS.start },
  { id: 'offline' },
  { id: 'noLogin', to: PATHS.settings },
  { id: 'cityTicket', to: matterPath('travel', 'cityTicket'), soon: true },
];
