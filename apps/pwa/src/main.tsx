import { themeCss } from '@mobywatel/brand';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './app/global.css';
import { Root } from './app/root.tsx';
import { router } from './app/router.tsx';
import { isEmbedded, reportRouteToShowcase } from './features/showcase/showcase-mode.ts';
import { localeFromSearch } from './platform/i18n.ts';
import { applySettings, readSettings, updateSettings } from './platform/settings.ts';

// Tokens as CSS variables, once, before first paint.
const style = document.createElement('style');
style.dataset.tokens = '';
style.textContent = themeCss();
document.head.prepend(style);
applySettings(readSettings());

// A shared link like /?lang=uk opens in that language and remembers it.
const linkLocale = localeFromSearch(window.location.search);
if (linkLocale) {
  updateSettings({ locale: linkLocale });
}

// Inside the desktop showcase's phone frame: keep the page's address bar in step with the app.
if (isEmbedded()) {
  reportRouteToShowcase(router);
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('#root missing in index.html');
}
createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
