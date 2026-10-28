import { Button } from '@mobywatel/ui';
import { useEffect } from 'react';
import { useTranslations } from 'use-intl';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UPDATE_CHECK_MS = 60 * 60 * 1000;

// registerType 'prompt': a new version never swaps code under someone mid-matter (pwa-platform skill).
// "Ready offline" is deliberately not a toast: it appeared on every first visit and covered content.
// It is exposed as <html data-offline-ready> for tests and debugging instead.
export function UpdatePrompt() {
  const t = useTranslations('common.pwa');
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    // vite-plugin-pwa checks for a new version only on page load. An installed iOS app can stay
    // alive for days, so also check whenever the app comes back to the foreground, and hourly.
    onRegisteredSW(_url, registration) {
      if (!registration) {
        return;
      }
      const check = () => {
        if (navigator.onLine) {
          void registration.update().catch(() => undefined);
        }
      };
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          check();
        }
      });
      setInterval(check, UPDATE_CHECK_MS);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      document.documentElement.dataset.offlineReady = 'true';
    }
  }, [offlineReady]);

  return (
    <div
      className="fixed left-1/2 bottom-[calc(var(--target-min)_+_env(safe-area-inset-bottom)_+_var(--space-3))] -translate-x-1/2 w-[min(28rem,calc(100%_-_var(--space-6)))] z-20"
      role="status"
      aria-live="polite"
    >
      {needRefresh && (
        <div className="flex flex-wrap items-center justify-between gap-2 py-3 px-4 border border-border-strong rounded-md bg-surface-raised text-text">
          <p className="m-0">{t('updateAvailable')}</p>
          <div className="flex gap-2">
            <Button onClick={() => void updateServiceWorker(true)}>{t('reload')}</Button>
            <Button variant="ghost" onClick={() => setNeedRefresh(false)}>
              {t('later')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
