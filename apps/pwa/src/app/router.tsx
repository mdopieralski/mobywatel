import { createBrowserRouter } from 'react-router';

import { StartScreen } from '../features/home/start-screen.tsx';
import { SettingsScreen } from '../features/settings/settings-screen.tsx';
import { Layout } from './layout.tsx';
import { NotFound } from './not-found.tsx';
import { RouteError } from './route-error.tsx';

// Polish paths: they show in the address bar and in shared links.
export const PATHS = {
  start: '/',
  settings: '/ustawienia',
} as const;

export const routes = [
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <StartScreen /> },
      { path: PATHS.settings, element: <SettingsScreen /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
