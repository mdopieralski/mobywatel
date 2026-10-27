import { RouterProvider } from 'react-router';
import { IntlProvider } from 'use-intl';

import { MESSAGES, TIME_ZONE } from '../platform/i18n.ts';
import { useSettings } from '../platform/settings.ts';
import { router } from './router.tsx';

export function App() {
  const { locale } = useSettings();
  return (
    <IntlProvider locale={locale} messages={MESSAGES[locale]} timeZone={TIME_ZONE}>
      <RouterProvider router={router} />
    </IntlProvider>
  );
}
