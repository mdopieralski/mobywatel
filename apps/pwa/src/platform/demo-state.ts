// Demo state (chosen persona, completed matters, dismissed reminders). Unlike settings, it is wiped
// by "Zresetuj demo" so every juror can start fresh (pwa-platform skill).

export const DEMO_PREFIX = 'demo:';
export const DEMO_DB = 'sprawnie-demo';

export async function resetDemo(): Promise<void> {
  try {
    const ls = globalThis.localStorage;
    Object.keys(ls)
      .filter((k) => k.startsWith(DEMO_PREFIX))
      .forEach((k) => ls.removeItem(k));
  } catch {
    // storage blocked: nothing persisted to clear
  }
  if (typeof indexedDB !== 'undefined') {
    await new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase(DEMO_DB);
      req.onsuccess = req.onerror = req.onblocked = () => resolve();
    });
  }
}
