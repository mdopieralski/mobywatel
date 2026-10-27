import { LOCALES } from '@mobywatel/brand';
import { describe, expect, it } from 'vitest';

import { localeFromSearch, messageFile, NAMESPACES } from './i18n.ts';

// key path -> message, for nested catalogues
function flatten(obj: Record<string, unknown>, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      flatten(value as Record<string, unknown>, path).forEach((v, k) => out.set(k, v));
    } else {
      out.set(path, String(value));
    }
  }
  return out;
}

// Top-level ICU argument names, e.g. {name} or {count, plural, …}; not the words inside plural branches.
const args = (message: string) => [...message.matchAll(/\{(\w+)\s*[,}]/g)].map((m) => m[1]).sort();

// A half-translated screen is worse than none (plain-polish skill): every locale mirrors Polish exactly.
describe.each(LOCALES.filter((l) => l !== 'pl'))('%s catalogue', (locale) => {
  it.each(NAMESPACES)('%s has the same keys and arguments as Polish', (ns) => {
    const source = flatten(messageFile('pl', ns) ?? {});
    const file = messageFile(locale, ns);
    expect(file, `messages/${locale}/${ns}.json is missing`).toBeDefined();
    const target = flatten(file ?? {});
    expect([...target.keys()].sort()).toEqual([...source.keys()].sort());
    for (const [key, message] of source) {
      expect(target.get(key)?.trim(), `${locale} ${ns}.${key} is empty`).toBeTruthy();
      expect(args(target.get(key) ?? ''), `${locale} ${ns}.${key} arguments`).toEqual(args(message));
    }
  });
});

describe('localeFromSearch', () => {
  it('reads a supported ?lang= and ignores the rest', () => {
    expect(localeFromSearch('?lang=uk')).toBe('uk');
    expect(localeFromSearch('?lang=fr')).toBeNull();
    expect(localeFromSearch('')).toBeNull();
  });
});
