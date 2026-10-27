// Languages the prototype speaks. Polish is the source; every other locale mirrors its keys
// (plain-polish skill, docs/decisions/languages-2026-10-25.md). Order = order in the language picker.
export const LOCALES = ['pl', 'en', 'uk', 'de', 'cs', 'sk', 'lt', 'be'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pl';

/** Each language's name in that language, so people find their own without reading Polish. */
export const LOCALE_NAMES: Record<Locale, string> = {
  pl: 'Polski',
  en: 'English',
  uk: 'Українська',
  de: 'Deutsch',
  cs: 'Čeština',
  sk: 'Slovenčina',
  lt: 'Lietuvių',
  be: 'Беларуская',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
