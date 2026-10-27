// Relative path on purpose: Vite bundles relative imports when loading its config, but leaves workspace
// packages external, and Node 22.15 cannot load .ts files. App code imports @mobywatel/brand normally.
import {
  BACKGROUND_COLOR,
  COLORS,
  MANIFEST_DESCRIPTION,
  TAGLINE,
  THEME_COLOR,
  WORKING_NAME,
} from '../../packages/brand/src/index.ts';
import react from '@vitejs/plugin-react';
import { BOOT_LOADER } from './src/app/boot-loader.ts';
import { VitePWA } from 'vite-plugin-pwa';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// Name and colours come from @mobywatel/brand so index.html, the manifest and the UI never drift.
function brandHtml(): Plugin {
  return {
    name: 'brand-html',
    transformIndexHtml: (html) =>
      html
        .replaceAll('%APP_NAME%', WORKING_NAME)
        .replaceAll('%APP_TITLE%', `${WORKING_NAME} – ${TAGLINE} (prototyp)`)
        .replaceAll('%THEME_COLOR%', THEME_COLOR)
        .replaceAll('%LOADER_HOLD%', `${BOOT_LOADER.holdMs}ms`)
        .replaceAll('%LOADER_FADE%', `${BOOT_LOADER.fadeMs}ms`)
        .replaceAll('%LOADER_BG%', COLORS.light.bg)
        .replaceAll('%LOADER_BG_DARK%', COLORS.dark.bg)
        .replaceAll('%LOADER_TRACK%', COLORS.light.border)
        .replaceAll('%LOADER_TRACK_DARK%', COLORS.dark.border)
        .replaceAll('%DESCRIPTION%', MANIFEST_DESCRIPTION),
  };
}

// Storybook (apps/design-system) runs on its own port. The PWA dev/preview server proxies it under
// /design-system, so with portless both live on one host: mobywatel.local and mobywatel.local/design-system.
const DESIGN_SYSTEM_PATH = '/design-system';
const designSystemTarget = `http://127.0.0.1:${process.env.DESIGN_SYSTEM_PORT ?? '6006'}`;
const designSystemProxy = {
  [`^${DESIGN_SYSTEM_PATH}/`]: {
    target: designSystemTarget,
    changeOrigin: true,
    ws: true,
    // Storybook serves its UI from the root, so strip the prefix. Its Vite HMR socket is the exception:
    // Storybook's Vite has base /design-system/ and expects the socket there.
    rewrite: (path: string) =>
      path.startsWith(`${DESIGN_SYSTEM_PATH}/?token=`) ? path : path.slice(DESIGN_SYSTEM_PATH.length),
  },
  // A few Storybook requests ignore the base and go to the root.
  '^/(storybook-server-channel|vite-inject-mocker-entry\\.js|@id/__x00__virtual:/@storybook/)': {
    target: designSystemTarget,
    changeOrigin: true,
    ws: true,
  },
};

// Storybook's UI uses relative URLs, so /design-system needs its trailing slash.
function designSystemSlash(): Plugin {
  const redirect = (req: { url?: string }, res: import('node:http').ServerResponse, next: () => void) => {
    if (req.url === DESIGN_SYSTEM_PATH || req.url?.startsWith(`${DESIGN_SYSTEM_PATH}?`)) {
      res.writeHead(301, { Location: req.url.replace(DESIGN_SYSTEM_PATH, `${DESIGN_SYSTEM_PATH}/`) });
      res.end();
      return;
    }
    next();
  };
  return {
    name: 'design-system-slash',
    configureServer: (server) => void server.middlewares.use(redirect),
    configurePreviewServer: (server) => void server.middlewares.use(redirect),
  };
}
// portless --lan serves the app as mobywatel.local; Vite only trusts localhost by default.
const allowedHosts = ['mobywatel.local', '.localhost'];

// https://vite.dev/config/ · PWA details: the pwa-platform skill
export default defineConfig({
  server: { allowedHosts, proxy: designSystemProxy },
  preview: { allowedHosts, proxy: designSystemProxy },
  plugins: [
    react(),
    brandHtml(),
    designSystemSlash(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: `${WORKING_NAME} – prototyp`,
        short_name: WORKING_NAME,
        description: MANIFEST_DESCRIPTION,
        lang: 'pl',
        dir: 'ltr',
        // The installed app opens the app, not the desktop landing page.
        start_url: '/prototype',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: THEME_COLOR,
        background_color: BACKGROUND_COLOR,
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        // Inter Tight is only for the desktop pages' nav: phones should not download it on install. It is
        // cached the first time a desktop page uses it, and the system font stands in until then.
        globIgnores: ['**/inter-tight-*.woff2'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/assets\/inter-tight-.*\.woff2$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              // Also filled by src/features/showcase/compact-font-cache.ts on the first visit.
              cacheName: 'compact-font',
              expiration: { maxEntries: 8 },
              // Font requests carry Origin (CORS) and the server answers Vary: Origin; the copies written
              // ahead of time were fetched without it. Same files either way.
              matchOptions: { ignoreVary: true },
            },
          },
        ],
        navigateFallback: '/index.html',
        // /design-system is Storybook behind the local proxy, not a PWA route.
        navigateFallbackDenylist: [/^\/api\//, /^\/design-system(\/|$)/],
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
