import { createBrowserRouter, Navigate, useLocation } from 'react-router';

import { CategoryScreen } from '../features/categories/category-screen.tsx';
import { MatterScreen } from '../features/categories/matter-screen.tsx';
import { ComingSoonScreen } from '../features/coming-soon/coming-soon-screen.tsx';
import { DocumentScreen } from '../features/documents/document-screen.tsx';
import { StartScreen } from '../features/home/start-screen.tsx';
import { RemindersScreen } from '../features/reminders/reminders-screen.tsx';
import { SettingsScreen } from '../features/settings/settings-screen.tsx';
import { Layout } from './layout.tsx';
import { NotFound } from './not-found.tsx';
import { PATHS, PROTOTYPE } from './paths.ts';
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
  // "/" in the app: only when a desktop window on the landing page is made narrow (on load, entry-url.ts
  // sends phones and tablets to /prototype). Show the start screen without changing the address, so
  // widening the window brings the landing page back.
  { path: PATHS.landing, element: <Layout />, children: [{ index: true, element: <StartScreen /> }] },
  {
    path: PROTOTYPE,
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
  // A path from before /prototype existed: the same screen under it (entry-url.ts does this on load).
  { path: '*', element: <MoveUnderPrototype /> },
];

function MoveUnderPrototype() {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={`${PROTOTYPE}${pathname}${search}${hash}`} replace />;
}

export const router = createBrowserRouter(routes);
