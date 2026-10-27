import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Regenerate the PNG icons from our own mark: `pnpm --filter @mobywatel/pwa run icons`.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#DC143C' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#DC143C' } },
  },
  images: ['public/icons/favicon.svg'],
});
