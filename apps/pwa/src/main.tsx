import { themeCss } from '@mobywatel/brand';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// First: settles the address (old links, "/" on a phone) before the router reads it.
import './app/entry-url.ts';
import './app/global.css';
import { BOOT_LOADER_END_MS, endIntro, endIntroOnInput } from './app/boot-loader.ts';
import { Root } from './app/root.tsx';
import { router } from './app/router.tsx';
import { isEmbedded, reportRouteToShowcase } from './features/showcase/showcase-mode.ts';
import { localeFromSearch } from './platform/i18n.ts';
import {
  applySettings,
  readSettings,
  updateSettings,
  watchSettingsFromOtherDocuments,
} from './platform/settings.ts';

// Tokens as CSS variables, once, before first paint.
const style = document.createElement('style');
style.dataset.tokens = '';
style.textContent = themeCss();
document.head.prepend(style);
applySettings(readSettings());

// The boot loader in index.html hides itself after BOOT_LOADER (CSS); drop it from the DOM once it has.
const bootLoader = document.getElementById('boot-loader');
bootLoader?.addEventListener('animationend', (event) => {
  if (event.target === bootLoader) {
    bootLoader.remove();
  }
});
// Inside a phone frame it never shows; and if this script ran late (slow network), it has already faded.
if (document.documentElement.hasAttribute('data-embedded') || performance.now() >= BOOT_LOADER_END_MS) {
  bootLoader?.remove();
}

// The header and hero entrance: none inside a phone frame, and it ends on the first key press or click.
if (document.documentElement.hasAttribute('data-embedded')) {
  endIntro();
} else {
  endIntroOnInput();
}

// A shared link like /?lang=uk opens in that language and remembers it.
const linkLocale = localeFromSearch(window.location.search);
if (linkLocale) {
  updateSettings({ locale: linkLocale });
}

// The desktop page and the app in its phone frame follow each other's settings (both ways).
watchSettingsFromOtherDocuments();

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
