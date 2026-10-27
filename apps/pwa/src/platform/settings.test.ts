import { beforeEach, describe, expect, it } from 'vitest';

import { DEMO_PREFIX, resetDemo } from './demo-state.ts';
import { applySettings, readSettings, resetSettingsCache, SETTINGS_KEY, updateSettings } from './settings.ts';

describe('settings', () => {
  beforeEach(() => {
    localStorage.clear();
    resetSettingsCache();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-senior');
  });

  it('defaults when storage is empty or corrupt', () => {
    localStorage.setItem(SETTINGS_KEY, '{not json');
    expect(readSettings()).toEqual({ senior: false, theme: 'system', locale: 'pl' });
  });

  it('ignores unknown values', () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ senior: 'yes', theme: 'neon', locale: 'xx' }));
    expect(readSettings()).toEqual({ senior: false, theme: 'system', locale: 'pl' });
  });

  it('persists and applies as attributes on <html>', () => {
    updateSettings({ senior: true, theme: 'dark', locale: 'uk' });
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}')).toEqual({
      senior: true,
      theme: 'dark',
      locale: 'uk',
    });
    expect(document.documentElement.dataset.senior).toBe('true');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.lang).toBe('uk');
    applySettings({ senior: false, theme: 'system', locale: 'pl' });
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('reset demo clears demo keys but keeps settings', async () => {
    updateSettings({ senior: true });
    localStorage.setItem(`${DEMO_PREFIX}persona`, 'x');
    await resetDemo();
    expect(localStorage.getItem(`${DEMO_PREFIX}persona`)).toBeNull();
    expect(localStorage.getItem(SETTINGS_KEY)).not.toBeNull();
  });
});
