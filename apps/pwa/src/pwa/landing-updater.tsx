import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * The landing page's service worker: registers it and takes a new version as soon as it is downloaded.
 * The app asks first (update-prompt.tsx) so code never changes mid-matter; the landing page has nothing to
 * lose, and without this a phone that opened "/" before a deploy kept the old page until every tab closed.
 * Also checks again when the page comes back to the foreground.
 */
export function LandingUpdater() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) {
        return;
      }
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && navigator.onLine) {
          void registration.update().catch(() => undefined);
        }
      });
    },
  });

  useEffect(() => {
    if (needRefresh) {
      void updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
