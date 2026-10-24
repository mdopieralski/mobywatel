import { RouterProvider } from 'react-router';
import { IntlProvider } from 'use-intl';

import { LOCALE, MESSAGES, TIME_ZONE } from '../platform/i18n.ts';
import { router } from './router.tsx';

export function App() {
  return (
    <IntlProvider locale={LOCALE} messages={MESSAGES} timeZone={TIME_ZONE}>
      <RouterProvider router={router} />
    </IntlProvider>
  );
}
