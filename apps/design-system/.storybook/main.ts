import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';

// In dev, Storybook sits behind the PWA dev server at /design-system (see apps/pwa/vite.config.ts).
const DEV_BASE = '/design-system/';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  // The browser's Origin is mobywatel.local (portless), not 127.0.0.1. Storybook rejects unknown origins.
  core: { allowedHosts: ['mobywatel.local', '.localhost'], disableTelemetry: true },
  viteFinal: (base, { configType }) => {
    // Tailwind, like the PWA (the classes in @mobywatel/ui come from global.css's theme).
    const vite = { ...base, plugins: [...(base.plugins ?? []), tailwindcss()] };
    if (configType !== 'DEVELOPMENT') {
      return vite; // static build keeps relative paths, so it can be hosted under any path
    }
    const hmr = typeof vite.server?.hmr === 'object' ? vite.server.hmr : {};
    // Drop Storybook's fixed HMR port: the browser then opens the HMR socket on the page's own
    // host (mobywatel.local), and the PWA proxy forwards it here.
    const { port: _port, ...hmrWithoutPort } = hmr;
    return { ...vite, base: DEV_BASE, server: { ...vite.server, hmr: hmrWithoutPort } };
  },
};

export default config;
