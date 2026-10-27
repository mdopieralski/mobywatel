// User settings (senior mode, theme, language). Persist across "reset demo" and are applied as attributes on
// <html> (design-system skill: themes are attribute switches, components never branch on theme).
import { DEFAULT_LOCALE, isLocale, type Locale } from '@mobywatel/brand';
import { useSyncExternalStore } from 'react';

export type ThemeChoice = 'system' | 'light' | 'dark';

export interface Settings {
  senior: boolean;
  theme: ThemeChoice;
  locale: Locale;
}

export const DEFAULT_SETTINGS: Settings = { senior: false, theme: 'system', locale: DEFAULT_LOCALE };
export const SETTINGS_KEY = 'settings:v1';

function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // private mode or blocked storage: settings live in memory only
  }
}

let current: Settings | null = null;
const listeners = new Set<() => void>();

export function readSettings(): Settings {
  if (current) {
    return current;
  }
  let parsed: Partial<Settings> = {};
  try {
    parsed = JSON.parse(storage()?.getItem(SETTINGS_KEY) ?? '{}') as Partial<Settings>;
  } catch {
    parsed = {};
  }
  current = {
    senior: typeof parsed.senior === 'boolean' ? parsed.senior : DEFAULT_SETTINGS.senior,
    theme: parsed.theme === 'light' || parsed.theme === 'dark' ? parsed.theme : DEFAULT_SETTINGS.theme,
    locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_SETTINGS.locale,
  };
  return current;
}

export function applySettings(s: Settings, root: HTMLElement = document.documentElement): void {
  root.dataset.senior = String(s.senior);
  // Screen readers pick their voice from lang (WCAG 3.1.1).
  root.lang = s.locale;
  if (s.theme === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = s.theme;
  }
}

export function updateSettings(patch: Partial<Settings>): Settings {
  current = { ...readSettings(), ...patch };
  try {
    storage()?.setItem(SETTINGS_KEY, JSON.stringify(current));
  } catch {
    // quota or blocked: keep the in-memory value
  }
  applySettings(current);
  listeners.forEach((l) => l());
  return current;
}

/** Another document (the showcase page or its framed app) changed the settings: re-read and re-render. */
export function reloadSettings(): void {
  current = null;
  applySettings(readSettings());
  listeners.forEach((l) => l());
}

/** Test hook: forget the cached value. */
export function resetSettingsCache(): void {
  current = null;
}

// Module-level so useSyncExternalStore keeps one subscription instead of resubscribing every render.
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, readSettings, readSettings);
}
