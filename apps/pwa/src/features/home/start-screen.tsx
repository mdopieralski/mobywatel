import { Disclaimer } from '@mobywatel/ui';
import { useLocation } from 'react-router';
import { useTranslations } from 'use-intl';

import { useAppLocale } from '../../platform/i18n.ts';
import { CategoryStack } from '../categories/category-stack.tsx';
import { ReminderTile } from '../reminders/reminder-tile.tsx';
import { AskBar } from './ask-bar.tsx';

// Start screen, modelled on the reference's: the category stack (documents live inside), the most urgent matter, "what do you
// need?". Our own artwork and the disclaimer (prototype-guardrails skill).
export function StartScreen() {
  const t = useTranslations('home');
  const tc = useTranslations('categories');
  const locale = useAppLocale();
  const demoReset = (useLocation().state as { demoReset?: boolean } | null)?.demoReset === true;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <p
        role="status"
        className={demoReset ? 'm-0 rounded-md bg-accent-soft px-4 py-3 text-text' : 'contents'}
      >
        {demoReset ? t('demoReset') : ''}
      </p>
      <h1 className="m-0 text-xl">{tc('title')}</h1>
      <CategoryStack />
      <ReminderTile />
      <Disclaimer variant="inline" locale={locale} />
      {/* Holds the prompt bar at the bottom of the screen, above the tab bar, while the categories scroll
          under it (user choice 2026-10-26): over the scroll area's bottom padding, full width in the page
          colour. In short windows (phone on its side, 400% zoom) the bar scrolls with the page, so it never
          covers the categories (the layout lets the whole page scroll there). */}
      <div className="sticky -bottom-4 z-1 -mx-4 -mb-4 bg-bg px-4 pt-3 pb-4 [@media(max-height:30rem)]:static">
        <AskBar />
      </div>
    </div>
  );
}
