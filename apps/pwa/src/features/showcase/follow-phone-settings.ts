import { useEffect } from 'react';

import { reloadSettings, SETTINGS_KEY } from '../../platform/settings.ts';

/** Theme, senior mode or language changed inside the phone: follow it on the page around it too. */
export function useFollowPhoneSettings(): void {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) {
        reloadSettings();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
}
