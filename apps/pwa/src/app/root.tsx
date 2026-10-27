import { lazy, Suspense } from 'react';
import { IntlProvider } from 'use-intl';

import { useShowcaseMode } from '../features/showcase/showcase-mode.ts';
import { MESSAGES, TIME_ZONE } from '../platform/i18n.ts';
import { useSettings } from '../platform/settings.ts';
import { App } from './app.tsx';
import { PATHS } from './router.tsx';

// Desktop-only page, so phones never download it.
const Showcase = lazy(() =>
  import('../features/showcase/showcase.tsx').then((m) => ({ default: m.Showcase }))
);

// Pages that stay full width on a desktop instead of going into the phone frame.
const FULL_PAGE_PATHS = [PATHS.brandVoice];

/** Wide screen: the showcase page with the app in a phone frame. Otherwise: the app. */
export function Root() {
  const { locale } = useSettings();
  if (!useShowcaseMode(FULL_PAGE_PATHS)) {
    return <App />;
  }
  return (
    <IntlProvider locale={locale} messages={MESSAGES[locale]} timeZone={TIME_ZONE}>
      <Suspense fallback={null}>
        <Showcase />
      </Suspense>
    </IntlProvider>
  );
}
