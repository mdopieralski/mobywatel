// Relative path on purpose: Vite bundles relative imports when loading its config, but leaves workspace
// packages external, and Node 22.15 cannot load .ts files. App code imports @mobywatel/brand normally.
import {
  BACKGROUND_COLOR,
  MANIFEST_DESCRIPTION,
  TAGLINE,
  THEME_COLOR,
  WORKING_NAME,
} from '../../packages/brand/src/index.ts';
import react from '@vitejs/plugin-react';
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
        .replaceAll('%DESCRIPTION%', MANIFEST_DESCRIPTION),
  };
}

// https://vite.dev/config/ · PWA details: the pwa-platform skill
export default defineConfig({
  plugins: [
    react(),
    brandHtml(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: `${WORKING_NAME} – prototyp`,
        short_name: WORKING_NAME,
        description: MANIFEST_DESCRIPTION,
        lang: 'pl',
        dir: 'ltr',
        start_url: '/',
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
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
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
