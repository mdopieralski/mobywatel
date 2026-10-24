import { themeCss } from '@mobywatel/brand';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/app.tsx';
import './app/global.css';
import { applySettings, readSettings } from './platform/settings.ts';

// Tokens as CSS variables, once, before first paint.
const style = document.createElement('style');
style.dataset.tokens = '';
style.textContent = themeCss();
document.head.prepend(style);
applySettings(readSettings());

const root = document.getElementById('root');
if (!root) {
  throw new Error('#root missing in index.html');
}
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
