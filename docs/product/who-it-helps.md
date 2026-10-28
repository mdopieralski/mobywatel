---
title: "Dla kogo" (Who it helps) – landing section plan
owner: product-manager
status: plan, awaiting approval
updated: 2026-10-28
sources:
  - product-manager: beneficiary list and ranking (2026-10-28)
  - service-designer: personas and copy, PL + EN (2026-10-28, not yet reviewed by plain-language-editor)
  - pwa-architect: build plan (2026-10-28)
---

# "Dla kogo" (Who it helps)

A new section on the desktop landing page `/`. Six fictional example people. Each shows one improvement that
**already works** in the prototype, with something the juror can try in the phone right away.

## Decisions

- **Illustrative personas, not app accounts.** The app has one persona (Katarzyna; `usePersona()` always
  returns her). The section says the people are fictional, and each button names the **screen** it opens
  ("Pokaż tryb dla seniora"), never "zobacz jako Teresa".
- **Only built claims.** No matter works end to end yet. No promises about completing matters, buying tickets,
  the assistant or ZUS. One card (city ticket) carries a visible "Wkrótce" badge. ZUS, carers and parents are
  left out until something works for them.
- **Placement:** after the phone, before news. Nav: **Start · Prototyp · Dla kogo · Nowości**. Section id
  `dla-kogo`, constant `AUDIENCE_ID`.
- **Framing:** person-first; language, not status, for Ukrainian speakers (no "uchodźcy", no flags); no
  "babcia" or "nawet senior" clichés; no population numbers.
- **Art:** six flat illustrated avatars in brand tokens, decorative (`alt=""`). No photos, no real-looking
  faces, no flags, no document or operator artwork.

## Beneficiaries (ranked by judging value)

| #   | Group                                     | Improvement (status)                                                                              | Persona                             |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------- |
| A   | Seniors                                   | Senior mode, 14 labelled categories (built)                                                       | Teresa, 74, Kalisz                  |
| B   | Screen-reader, keyboard, low-vision users | Axe WCAG 2.2 AA on every screen, focus to heading, dark theme (built; no real VoiceOver pass yet) | Marek, 41, Gdańsk                   |
| C   | Ukrainian speakers and neighbours         | 8 complete languages, offline (built; screens only)                                               | Oksana, 36, Wrocław                 |
| D   | Patchy internet                           | Offline after first load, installable (built; only on a build/deploy)                             | Krzysztof, 58, a village near Sanok |
| E   | Wary of accounts and AI keys              | No login, no key, reset demo (built)                                                              | Ewa, 47, Lublin                     |
| F   | Commuters and visitors                    | Pick one of 969 towns (built); buying (Wkrótce)                                                   | Kuba, 23, Olsztyn                   |

## Copy – Polish (source)

Keys in `showcase` namespace: `nav.audience`, `audience.{title, lead, fictionNote, tryLabel}`,
`audience.people.<id>.{name, meta, need, helps, try, open?}`. "Wkrótce" badge reuses `soon.badge`.

- **nav.audience:** Dla kogo
- **title:** Dla kogo?
- **lead:** Przykładowe osoby i to, co w prototypie ułatwia im sprawy. Przy każdej jest coś do wypróbowania.
- **fictionNote:** To postacie fikcyjne, wymyślone przez nas. Nie są kontami w aplikacji. W prototypie zawsze
  widzisz dane fikcyjnej Katarzyny.
- **tryLabel:** Wypróbuj:

| id                   | name · meta                          | need                                                                                   | helps                                                                                                                      | try                                                                          | open (button)            |
| -------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------ |
| senior               | Teresa · 74 lata, Kalisz             | Lubię duże litery. Wolę wybrać sprawę z listy, niż wymyślać, o co zapytać.             | Tryb dla seniora powiększa tekst i przyciski, a aplikacja go zapamięta. Na starcie widzisz 14 podpisanych kategorii spraw. | Otwórz Ustawienia i włącz Tryb dla seniora.                                  | Pokaż tryb dla seniora   |
| screenReader         | Marek · 41 lat, Gdańsk               | Korzystam z czytnika ekranu i klawiatury. Po każdym kroku chcę wiedzieć, gdzie jestem. | Każdy ekran przechodzi automatyczny test dostępności WCAG 2.2 AA. Po każdym kroku czytnik zaczyna od nagłówka.             | Przejdź aplikację samym klawiszem Tab. W Ustawieniach wybierz wygląd Ciemny. | Pokaż ustawienia wyglądu |
| languages            | Oksana · 36 lat, Wrocław             | Mówię po polsku, ale sprawy urzędowe wolę czytać po ukraińsku.                         | Aplikacja ma 8 języków, każdy w całości i bez internetu. Tłumaczymy ekrany aplikacji, nie dokumenty.                       | Naciśnij „PL” w nagłówku aplikacji i wybierz Українська.                     | Pokaż wybór języka       |
| offline              | Krzysztof · 58 lat, wieś koło Sanoka | W domu internet raz jest, a raz go nie ma.                                             | Po pierwszym otwarciu aplikacja działa bez internetu. Dodasz ją do ekranu telefonu jak zwykłą aplikację.                   | Otwórz ten adres w telefonie, włącz tryb samolotowy i odśwież stronę.        | — (no button)            |
| noLogin              | Ewa · 47 lat, Lublin                 | Nie lubię zakładać konta, gdy chcę tylko coś sprawdzić.                                | Nie zakładasz konta i nie podajesz klucza do AI. Wszystko działa w przeglądarce. Demo zaczniesz od nowa, kiedy chcesz.     | Otwórz Ustawienia i wybierz Zresetuj demo.                                   | Pokaż Ustawienia         |
| cityTicket (Wkrótce) | Kuba · 23 lata, Olsztyn              | Często jeżdżę do innych miast. Za każdym razem szukam nowej aplikacji na bilet.        | Wybierasz jedno z 969 miast. Możesz pisać bez polskich liter, np. „lodz”. Kupowanie biletów dodamy wkrótce.                | Otwórz Podróż, potem Bilet miejski. Wpisz „lodz”.                            | Pokaż wybór miasta       |

## Copy – English

- **nav.audience / title:** Who it helps
- **lead:** Example people and what the prototype makes easier for them. Each one has something to try.
- **fictionNote:** These are fictional characters we made up. They aren't accounts in the app. The prototype
  always shows fictional Katarzyna's data.
- **tryLabel:** Try it:

| id           | name · meta                          | need                                                                                | helps                                                                                                                      | try                                                                                | open                     |
| ------------ | ------------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| senior       | Teresa · 74, Kalisz                  | I like large print. I'd rather pick a matter from a list than work out what to ask. | Senior mode makes text and buttons bigger, and the app remembers it. The start screen shows 14 labelled categories.        | Open Settings and turn on Senior mode.                                             | Show senior mode         |
| screenReader | Marek · 41, Gdańsk                   | I use a screen reader and a keyboard. After each step I want to know where I am.    | Every screen passes an automated WCAG 2.2 AA accessibility test. After each step, the screen reader starts at the heading. | Go through the app with the Tab key only. In Settings, choose the Dark appearance. | Show appearance settings |
| languages    | Oksana · 36, Wrocław                 | I speak Polish, but I'd rather read official matters in Ukrainian.                  | The app has 8 languages, each complete and offline. We translate the app's screens, not documents.                         | Tap "PL" in the app header and choose Українська.                                  | Show language choice     |
| offline      | Krzysztof · 58, a village near Sanok | At home the internet comes and goes.                                                | After the first visit the app works without internet. Add it to your home screen like any other app.                       | Open this address on your phone, turn on airplane mode and reload the page.        | —                        |
| noLogin      | Ewa · 47, Lublin                     | I don't like creating an account when I only want to check something.               | No account, no AI key. Everything runs in your browser. Start the demo again whenever you like.                            | Open Settings and choose Reset demo.                                               | Show Settings            |
| cityTicket   | Kuba · 23, Olsztyn                   | I often travel to other towns. Each time I look for a new ticket app.               | Pick any of 969 towns. You can type without Polish letters, e.g. "lodz". Buying tickets is coming soon.                    | Open Travel, then City ticket. Type "lodz".                                        | Show city choice         |

The other six locales (uk de cs sk lt be) are translated at build time; all 8 must be complete
(`i18n.test.ts`).

## Illustration brief (brand-designer)

One flat style, brand-token colours (`currentColor` / CSS vars, no hex), decorative.

1. **Teresa:** short grey hair, reading glasses, armchair, phone with a few large blocks. No cane or frailty
   cues.
2. **Marek:** over-ear headphones, hands on a keyboard, phone with a dark screen. No dark glasses or white
   cane.
3. **Oksana:** phone and a speech bubble with "Aa" and "Яя". No blue-yellow pairing, no costume.
4. **Krzysztof:** by a fence and a field, phone with one signal bar and a "saved" tick.
5. **Ewa:** kitchen table, a cup, calm browsing, small circular "start again" arrow. No padlock.
6. **Kuba:** backpack, generic tram stop, abstract tram from no real city.

## Build plan

### Files

| File                                                 | Change                                                                                                                                        | Owner                                         |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `apps/pwa/src/features/showcase/showcase-mode.ts`    | `export const AUDIENCE_ID = 'dla-kogo'`                                                                                                       | ui-engineer                                   |
| `apps/pwa/src/features/showcase/audience.ts`         | new: typed `AUDIENCE` list `{ id, avatar, to?, soon? }`, paths built from `PATHS`, never hand-typed                                           | ui-engineer                                   |
| `apps/pwa/src/features/showcase/audience.test.ts`    | new: every `to` resolves to a real route                                                                                                      | ui-engineer                                   |
| `apps/pwa/src/features/showcase/who-it-helps.tsx`    | new: `<WhoItHelps ref onTry />` section, list, cards, buttons                                                                                 | ui-engineer                                   |
| `apps/pwa/src/features/showcase/showcase.tsx`        | render the section as a direct child of `<main>` (for snap); one `sections` list feeds nav links, IntersectionObserver and the hash allowlist | ui-engineer                                   |
| `apps/pwa/src/features/showcase/prototype-page.tsx`  | header link `/#dla-kogo`, so both desktop pages share the nav                                                                                 | ui-engineer                                   |
| `apps/pwa/src/features/showcase/showcase.module.css` | new `.audience`, `.people`, `.person`, `.avatar` rules only (tokens)                                                                          | ui-engineer                                   |
| `packages/brand/src/avatars/*`                       | six SVG avatars                                                                                                                               | brand-designer                                |
| `apps/pwa/messages/*/showcase.json`                  | `nav.audience` + `audience.*` (8 locales)                                                                                                     | service-designer (copy), ui-engineer (wiring) |
| `apps/pwa/e2e/showcase.spec.ts`                      | new tests (below)                                                                                                                             | qa-engineer                                   |
| `docs/product/visual-identity.md`                    | avatar style rules                                                                                                                            | brand-designer                                |

`site-header.tsx` and `section-snap.ts` need no change.

### The "Pokaż …" button

A real `<a href="/prototype/…" target="phone">`, so it works without JS. On click:
`navigatePhone(frame, path)`; if that succeeds, prevent the default and `goTo(trySection)` so the phone
scrolls into view and focus moves to the "Prototyp" region. Reduced motion: no entrance animation; `goTo`
already jumps instantly.

### Layout

3×2 grid at 1440 px, 2 then 1 columns when narrower. Keep it within about one viewport (900 px), so the
section snap doesn't jump.

### Order of work

1. **Before anything:** the hero rework in another session (`showcase-hero.tsx`, hero CSS and copy, hero e2e)
   lands first. This plan touches neither the hero files nor the hero copy. Branch from that work.
2. In parallel: brand-designer draws the avatars; ui-engineer builds the section with the PL/EN copy above
   (other locales start as copies flagged for translation).
3. service-designer translates to all 8 locales; plain-language-editor reviews.
4. qa-engineer writes the e2e tests; accessibility-auditor runs one VoiceOver pass; code-reviewer reviews.

### Acceptance criteria

1. Nav order is Start · Prototyp · Dla kogo · Nowości. Clicking "Dla kogo" scrolls to and focuses `#dla-kogo`
   and marks the link `aria-current="location"` (e2e).
2. `/#dla-kogo` opens on the section; `/prototype` has a "Dla kogo" link to it (e2e).
3. Region "Dla kogo?" with an h2, a list of 6 items, an h3 name each, unique button names, the fiction note
   visible, the "Wkrótce" badge in text (e2e role queries).
4. Each button puts its screen in the phone (h1 inside `iframe[name="phone"]`), focuses `#wyprobuj`, and the
   URL stays `/`. Chrome and Safari (e2e).
5. Axe: 0 WCAG 2.2 A/AA violations on `/`, also in dark and senior mode (e2e).
6. All 8 locales complete (`i18n.test.ts`).
7. No hex, no photos, no official marks (post-edit hook, `pnpm run audit:guardrails`).
8. `pnpm run typecheck`, `pnpm test` and `pnpm run ci:quality` pass.

## Open questions

1. **Language button (C):** the language menu is in the app header, not a route. Either open the start screen
   and say "naciśnij PL", or add a way to open the menu from a link. Avoid `?lang=`: it also switches the
   language of the whole landing page.
2. **"Sprawdź:" vs "Wypróbuj:"** in "Co nowego": use "Wypróbuj:" in both? Also `new.languages.try` says
   "Kliknij"; the word list wants "Naciśnij".
3. **Phase 2 (optional, after the MVP):** real switchable personas in `packages/content` with `?osoba=<id>`
   and "Zobacz jako Teresa". Needs domain-engineer and pwa-engineer. Also: Katarzyna's dates are fixed ISO
   dates and will go stale before the results; domain-engineer should make them relative to today.
4. **Claims to back with a test before merge:** "follows the phone's text size" (200 % root-font e2e), and
   senior mode being remembered after a reload.
