import { themeCss } from '@mobywatel/brand';
import type { Preview } from '@storybook/react-vite';

// The PWA's base styles (font, colours, focus ring). If more apps need them, move them to @mobywatel/ui.
import '../../pwa/src/app/global.css';

// Same token sheet the PWA injects in main.tsx, so components look the same here and in the app.
const style = document.createElement('style');
style.dataset.tokens = '';
style.textContent = themeCss();
document.head.prepend(style);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Motyw',
      toolbar: {
        title: 'Motyw',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'Systemowy' },
          { value: 'light', title: 'Jasny' },
          { value: 'dark', title: 'Ciemny' },
        ],
        dynamicTitle: true,
      },
    },
    senior: {
      description: 'Tryb seniora (duży tekst)',
      toolbar: {
        title: 'Senior',
        icon: 'accessibility',
        items: [
          { value: 'off', title: 'Zwykły tekst' },
          { value: 'on', title: 'Tryb seniora' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'system', senior: 'off' },
  decorators: [
    (Story, { globals }) => {
      // Themes are attribute switches on <html>, as in the PWA (brand css.ts).
      const html = document.documentElement;
      if (globals.theme === 'light' || globals.theme === 'dark') {
        html.dataset.theme = globals.theme;
      } else {
        delete html.dataset.theme;
      }
      if (globals.senior === 'on') {
        html.dataset.senior = 'true';
      } else {
        delete html.dataset.senior;
      }
      return <Story />;
    },
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};

export default preview;
