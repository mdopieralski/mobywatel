---
title: Eight UI languages
status: accepted
date: 2026-10-25
decided_by: the user
owner: pwa-engineer (runtime), service-designer (copy)
---

# Eight UI languages

## Decision

The prototype speaks **Polish (source), English, Ukrainian, German, Czech, Slovak, Lithuanian and
Belarusian**: `pl`, `en`, `uk`, `de`, `cs`, `sk`, `lt`, `be`.

- **List and names:** `@mobywatel/brand` `locales.ts` holds the list (`LOCALES`) and each language's own name
  (`LOCALE_NAMES`).
- **Brand strings:** the tagline and the disclaimer are translated in `copy.ts` (`TAGLINES`,
  `UNOFFICIAL_DISCLAIMERS`). The disclaimer keeps its full meaning in every language.
- **UI copy:** `apps/pwa/messages/<locale>/<namespace>.json`. Polish defines the keys, and
  `src/platform/i18n.test.ts` fails if another locale is missing a key, has an empty one or changes an ICU
  argument.
- **Choosing a language:**
  - The language is a setting (`settings:v1` → `locale`) and defaults to Polish. It sets `<html lang>`.
  - It is picked at the top of Settings. Each language name is marked with its own `lang`.
  - A globe + code link in the header ("🌐 UK") is findable without reading the current language.
  - `?lang=uk` in a link opens the app in that language and remembers it.
- **Offline and dates:** all catalogues are bundled, so every language works offline. Dates and times use the
  locale with the `Europe/Warsaw` time zone.

## Why

Poland's largest groups of foreign residents and visitors speak Ukrainian, Belarusian, English and German, and
the neighbours speak Czech, Slovak and Lithuanian. "More accessible" is a judging angle, and a stranger in a
Polish office is a real persona.

## Consequences

- **Machine-drafted.** Every language except Polish was drafted by Claude. Before submission, a native speaker
  checks each one (brand-voice.md §12). Belarusian uses the official orthography. Lithuanian and Belarusian
  need the closest look.
- **Register:**
  - Every language uses the informal "you", as brand-voice.md §12 requires (ти, ты, du, ty, tu).
  - **Open:** German public services normally use "Sie". Ask a German reader whether "du" feels wrong for a
    state service.
- **Not translated (on purpose):**
  - the product name;
  - the "PROTOTYP – nie jest dokumentem" watermark on documents;
  - the manifest description;
  - the team page `/brand-voice` (English);
  - the route paths (`/ustawienia`).
- **Future copy:** every new message key needs all 8 languages in the same PR, or the unit test fails.
  Scenario text in `packages/content` follows the same rule when the assistant arrives.
- **Bundle:** about 2 KB per language today. Switch to one lazily loaded chunk per locale once the copy grows
  (Workbox precaches the chunks, so offline still works).
