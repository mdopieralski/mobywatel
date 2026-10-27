// Product copy constants. UI copy lives in apps/pwa/messages; this file holds what must be identical
// everywhere (name, disclaimer) and what the build reads (manifest).
import type { Locale } from './locales.ts';

/** Working name, TBD by product-manager + brand-designer. Never the mObywatel name or marks alone. */
export const WORKING_NAME = 'Sprawnie';

export const TAGLINE = 'Sprawy urzędowe prościej';

/** Required on the start screen and every document view (prototype-guardrails skill). */
export const UNOFFICIAL_DISCLAIMER =
  'Nieoficjalny prototyp na konkurs mobywatel.ai. To nie jest aplikacja mObywatel. Wszystkie osoby i dane są fikcyjne.';

/** The tagline in every UI language (Polish is the source: TAGLINE). */
export const TAGLINES: Record<Locale, string> = {
  pl: TAGLINE,
  en: 'Official matters, made simpler',
  uk: 'Офіційні справи – простіше',
  de: 'Behördensachen einfacher',
  cs: 'Úřední záležitosti jednodušeji',
  sk: 'Úradné veci jednoduchšie',
  lt: 'Oficialūs reikalai paprasčiau',
  be: 'Афіцыйныя справы – прасцей',
};

/**
 * The disclaimer in every UI language. Same meaning in full: unofficial, for the challenge, not the
 * mObywatel app, fictional people and data (brand-voice.md §12). Machine-drafted except pl; needs a
 * native check before submission.
 */
export const UNOFFICIAL_DISCLAIMERS: Record<Locale, string> = {
  pl: UNOFFICIAL_DISCLAIMER,
  en: 'Unofficial prototype for the mobywatel.ai challenge. This is not the mObywatel app. All people and data are fictional.',
  uk: 'Неофіційний прототип для конкурсу mobywatel.ai. Це не застосунок mObywatel. Усі особи та дані вигадані.',
  de: 'Inoffizieller Prototyp für den Wettbewerb mobywatel.ai. Das ist nicht die App mObywatel. Alle Personen und Daten sind erfunden.',
  cs: 'Neoficiální prototyp pro soutěž mobywatel.ai. Toto není aplikace mObywatel. Všechny osoby a údaje jsou smyšlené.',
  sk: 'Neoficiálny prototyp pre súťaž mobywatel.ai. Toto nie je aplikácia mObywatel. Všetky osoby a údaje sú vymyslené.',
  lt: 'Neoficialus prototipas konkursui mobywatel.ai. Tai nėra programėlė mObywatel. Visi asmenys ir duomenys yra išgalvoti.',
  be: 'Неафіцыйны прататып для конкурсу mobywatel.ai. Гэта не праграма mObywatel. Усе асобы і даныя выдуманыя.',
};

/** Watermark on every document view. */
export const DOCUMENT_WATERMARK = 'PROTOTYP – nie jest dokumentem';

export const MANIFEST_DESCRIPTION =
  'Nieoficjalny prototyp aplikacji do spraw urzędowych, przygotowany na konkurs mobywatel.ai. Dane są fikcyjne.';
