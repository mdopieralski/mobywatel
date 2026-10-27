import { lazy, Suspense } from 'react';
import { IntlProvider } from 'use-intl';

import { usePageKind } from '../features/showcase/showcase-mode.ts';
import { MESSAGES, TIME_ZONE } from '../platform/i18n.ts';
import { useSettings } from '../platform/settings.ts';
import { App } from './app.tsx';

// Desktop-only pages, so phones and tablets never download them.
const Showcase = lazy(() =>
  import('../features/showcase/showcase.tsx').then((m) => ({ default: m.Showcase }))
);
const PrototypePage = lazy(() =>
  import('../features/showcase/prototype-page.tsx').then((m) => ({ default: m.PrototypePage }))
);

/**
 * Desktop: "/" is the landing page, /prototype/* the app in a phone mockup. Phones, tablets, the installed
 * app and the framed copy inside the mockup: the app itself.
 */
export function Root() {
  const { locale } = useSettings();
  const kind = usePageKind();
  if (kind === 'app') {
    return <App />;
  }
  return (
    <IntlProvider locale={locale} messages={MESSAGES[locale]} timeZone={TIME_ZONE}>
      <Suspense fallback={null}>{kind === 'landing' ? <Showcase /> : <PrototypePage />}</Suspense>
    </IntlProvider>
  );
}
