// Message catalogue: apps/pwa/messages/<locale>/<namespace>.json. Polish is the source and defines the
// shape; every other locale mirrors its keys (i18n.test.ts enforces it). All bundled, so every language
// works offline. The copy is small; split per locale with import() once it grows.
import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from '@mobywatel/brand';
import { useLocale } from 'use-intl';

import categories from '../../messages/pl/categories.json';
import common from '../../messages/pl/common.json';
import documents from '../../messages/pl/documents.json';
import home from '../../messages/pl/home.json';
import settings from '../../messages/pl/settings.json';
import showcase from '../../messages/pl/showcase.json';
import soon from '../../messages/pl/soon.json';

export const TIME_ZONE = 'Europe/Warsaw';

const SOURCE = { categories, common, documents, home, settings, showcase, soon };

export type Messages = typeof SOURCE;
export type Namespace = keyof Messages;
export const NAMESPACES = Object.keys(SOURCE) as Namespace[];

const files = import.meta.glob<Record<string, unknown>>('../../messages/*/*.json', {
  eager: true,
  import: 'default',
});

/** Raw catalogue file, or undefined when a locale is missing a namespace (the test reports it). */
export function messageFile(locale: Locale, namespace: Namespace): Record<string, unknown> | undefined {
  return files[`../../messages/${locale}/${namespace}.json`];
}

export const MESSAGES = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    locale === DEFAULT_LOCALE
      ? SOURCE
      : Object.fromEntries(NAMESPACES.map((ns) => [ns, messageFile(locale, ns) ?? SOURCE[ns]])),
  ])
) as Record<Locale, Messages>;

/** `?lang=uk` in a shared link picks the language on first open. */
export function localeFromSearch(search: string): Locale | null {
  const lang = new URLSearchParams(search).get('lang');
  return isLocale(lang) ? lang : null;
}

/** The current UI language. Safe to narrow: the providers only ever receive a Locale. */
export function useAppLocale(): Locale {
  return useLocale() as Locale;
}
