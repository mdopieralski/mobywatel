// Words in the video. The app screens use the app's own catalogues (apps/pwa/messages), so the video shows
// what the app says, in every language. The captions and chapter names come from the landing page's demo
// block (showcase.json), the same text the page shows as captions. Only the proposal screens, which the
// app doesn't have yet, keep their Polish words here.
import { LOCALES, type Locale } from '@mobywatel/brand';

import showcasePl from '../../pwa/messages/pl/showcase.json';
import categories_pl from '../../pwa/messages/pl/categories.json';
import common_pl from '../../pwa/messages/pl/common.json';
import documents_pl from '../../pwa/messages/pl/documents.json';
import soon_pl from '../../pwa/messages/pl/soon.json';
import categories_en from '../../pwa/messages/en/categories.json';
import common_en from '../../pwa/messages/en/common.json';
import documents_en from '../../pwa/messages/en/documents.json';
import soon_en from '../../pwa/messages/en/soon.json';
import categories_uk from '../../pwa/messages/uk/categories.json';
import common_uk from '../../pwa/messages/uk/common.json';
import documents_uk from '../../pwa/messages/uk/documents.json';
import soon_uk from '../../pwa/messages/uk/soon.json';
import categories_de from '../../pwa/messages/de/categories.json';
import common_de from '../../pwa/messages/de/common.json';
import documents_de from '../../pwa/messages/de/documents.json';
import soon_de from '../../pwa/messages/de/soon.json';
import categories_cs from '../../pwa/messages/cs/categories.json';
import common_cs from '../../pwa/messages/cs/common.json';
import documents_cs from '../../pwa/messages/cs/documents.json';
import soon_cs from '../../pwa/messages/cs/soon.json';
import categories_sk from '../../pwa/messages/sk/categories.json';
import common_sk from '../../pwa/messages/sk/common.json';
import documents_sk from '../../pwa/messages/sk/documents.json';
import soon_sk from '../../pwa/messages/sk/soon.json';
import categories_lt from '../../pwa/messages/lt/categories.json';
import common_lt from '../../pwa/messages/lt/common.json';
import documents_lt from '../../pwa/messages/lt/documents.json';
import soon_lt from '../../pwa/messages/lt/soon.json';
import categories_be from '../../pwa/messages/be/categories.json';
import common_be from '../../pwa/messages/be/common.json';
import documents_be from '../../pwa/messages/be/documents.json';
import soon_be from '../../pwa/messages/be/soon.json';

type Json = Record<string, unknown>;

// The namespaces the app screens in the video need, in every language.
const CATALOGUES: Record<Locale, Record<string, Json>> = {
  pl: { categories: categories_pl, common: common_pl, documents: documents_pl, soon: soon_pl },
  en: { categories: categories_en, common: common_en, documents: documents_en, soon: soon_en },
  uk: { categories: categories_uk, common: common_uk, documents: documents_uk, soon: soon_uk },
  de: { categories: categories_de, common: common_de, documents: documents_de, soon: soon_de },
  cs: { categories: categories_cs, common: common_cs, documents: documents_cs, soon: soon_cs },
  sk: { categories: categories_sk, common: common_sk, documents: documents_sk, soon: soon_sk },
  lt: { categories: categories_lt, common: common_lt, documents: documents_lt, soon: soon_lt },
  be: { categories: categories_be, common: common_be, documents: documents_be, soon: soon_be },
};

function load(locale: Locale, namespace: string): Json {
  return CATALOGUES[locale][namespace] ?? {};
}

function pick(obj: unknown, path: string): string {
  const value = path.split('.').reduce<unknown>((o, k) => (o as Json | undefined)?.[k], obj);
  return typeof value === 'string' ? value : path;
}

/** `app(locale)('categories', 'names.zus')`: a string from the app's catalogue in that language. */
export function app(locale: Locale) {
  return (namespace: string, path: string) => pick(load(locale, namespace), path);
}

export const DEMO = showcasePl.demo;

export function cue(key: string): string {
  return pick(DEMO.cues, key);
}

export { LOCALES };

/**
 * The visit is offered on the next two working days a week after the render, so a re-render never shows a
 * date in the past (fictional slots).
 */
function workdaysFromNextWeek(count: number, from = new Date()): Date[] {
  const day = new Date(from);
  day.setDate(day.getDate() + 7);
  const out: Date[] = [];
  while (out.length < count) {
    if (day.getDay() !== 0 && day.getDay() !== 6) {
      out.push(new Date(day));
    }
    day.setDate(day.getDate() + 1);
  }
  return out;
}

const VISIT_DAYS = workdaysFromNextWeek(2);
const DAY_LONG = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
const DAY_SHORT = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'numeric' });

/** Proposal screens (not in the app yet), the badges and the closing card. Polish only, like the render. */
export const V = {
  prototype: 'PROTOTYP · nieoficjalny',
  proposal: 'Propozycja · jeszcze nie działa',
  live: 'Działa w prototypie',
  url: 'sprawnie-prototype.vercel.app',
  outroTitle: 'Sprawdź prototyp',
  outroBody: 'Link działa bez logowania, na telefonie i na komputerze.',
  offline: 'Tryb samolotowy',
  visit: {
    title: 'Wizyta w ZUS',
    topicQuestion: 'W jakiej sprawie chcesz przyjść?',
    topics: ['Zasiłek', 'Emerytura', 'Składki', 'Inna sprawa'],
    slotQuestion: 'Wybierz termin',
    place: 'Placówka blisko Ciebie: ul. Przykładowa 1, Kraków',
    days: VISIT_DAYS.map((d) => DAY_LONG.format(d)),
    times: ['9:00', '10:30', '12:15'],
    confirmTitle: 'Umówisz wizytę w ZUS',
    rows: [
      ['Sprawa', 'Zasiłek'],
      ['Gdzie', 'ul. Przykładowa 1, Kraków'],
      ['Kiedy', `${DAY_SHORT.format(VISIT_DAYS[0] ?? new Date())}, 10:30`],
      ['Twoje dane', 'Katarzyna Lipska'],
    ],
    confirm: 'Umów wizytę',
    change: 'Zmień',
    doneTitle: 'Wizyta umówiona',
    doneBody: 'Przypomnimy Ci dzień wcześniej. Odwołasz ją w aplikacji.',
    nothingSent: 'W prototypie nic nie zostało wysłane.',
  },
  ticket: {
    title: 'Bilet miejski',
    city: 'Łódź',
    typeQuestion: 'Jaki bilet?',
    types: [
      ['20 minut', '4,99 zł'],
      ['60 minut', '7,49 zł'],
      ['24 godziny', '9,99 zł'],
    ],
    priceNote: 'Ceny są przykładowe.',
    confirmTitle: 'Kupisz bilet 24-godzinny w Łodzi',
    rows: [
      ['Miasto', 'Łódź'],
      ['Bilet', '24 godziny, normalny'],
      ['Od kiedy', 'od razu'],
      ['Cena', '9,99 zł (przykładowa)'],
    ],
    confirm: 'Kup bilet',
    change: 'Zmień',
    activeTitle: 'Twój bilet',
    activeType: '24 godziny, normalny',
    validFor: 'Ważny jeszcze',
    watermark: 'PROTOTYP – nie jest biletem',
    nothingPaid: 'W prototypie nic nie zostało zapłacone.',
  },
} as const;
