import { createBrowserRouter } from 'react-router';

import { CategoryScreen } from '../features/categories/category-screen.tsx';
import { MatterScreen } from '../features/categories/matter-screen.tsx';
import { ComingSoonScreen } from '../features/coming-soon/coming-soon-screen.tsx';
import { DocumentScreen } from '../features/documents/document-screen.tsx';
import { StartScreen } from '../features/home/start-screen.tsx';
import { RemindersScreen } from '../features/reminders/reminders-screen.tsx';
import { SettingsScreen } from '../features/settings/settings-screen.tsx';
import { Layout } from './layout.tsx';
import { NotFound } from './not-found.tsx';
import { PATHS } from './paths.ts';
import { RouteError } from './route-error.tsx';

export { PATHS };

export const routes = [
  {
    path: PATHS.brandVoice,
    errorElement: <RouteError />,
    lazy: async () => {
      const { BrandVoicePage } = await import('../features/brand-voice/brand-voice-page.tsx');
      return { Component: BrandVoicePage };
    },
  },
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <StartScreen /> },
      { path: PATHS.settings, element: <SettingsScreen /> },
      { path: `${PATHS.categories}/:category`, element: <CategoryScreen /> },
      { path: `${PATHS.categories}/:category/:matter`, element: <MatterScreen /> },
      { path: `${PATHS.documents}/:kind`, element: <DocumentScreen /> },
      { path: PATHS.reminders, element: <RemindersScreen /> },
      { path: PATHS.assistant, element: <ComingSoonScreen screen="assistant" /> },
      // Header shortcuts: placeholders until the features exist (docs/product/reference-analysis.md).
      { path: PATHS.inbox, element: <ComingSoonScreen screen="inbox" /> },
      { path: PATHS.notifications, element: <ComingSoonScreen screen="notifications" /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
