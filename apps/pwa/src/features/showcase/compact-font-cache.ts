// Inter Tight is not precached (phones never use it); the service worker serves it CacheFirst from the
// "compact-font" cache (vite.config.ts). The first visit is not controlled by the worker (registerType
// 'prompt'), so its own font requests never reach that cache. Writing the files into it here, once the
// worker is installed, keeps the desktop pages' nav font offline from the next load on.
import cyrillic from '@fontsource-variable/inter-tight/files/inter-tight-cyrillic-wght-normal.woff2?url';
import latinExt from '@fontsource-variable/inter-tight/files/inter-tight-latin-ext-wght-normal.woff2?url';
import latin from '@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2?url';

/** Same name as the runtime cache in vite.config.ts. */
const CACHE = 'compact-font';
let warmed = false;

export function warmCompactFontCache(): void {
  if (warmed || !('serviceWorker' in navigator) || !('caches' in window)) {
    return;
  }
  warmed = true;
  void navigator.serviceWorker.ready
    .then(() => caches.open(CACHE))
    .then((cache) => cache.addAll([latin, latinExt, cyrillic]))
    .catch(() => undefined);
}
