---
title: The prototype website in all eight languages
status: proposed (not started)
date: 2026-10-28
owner: main session (coordinates), language-engineer (translations)
---

# The prototype website in all eight languages

## Goal

The desktop website around the prototype works fully in every language the prototype speaks: `pl` (source),
`en`, `uk`, `de`, `cs`, `sk`, `lt` and `be` (`docs/decisions/languages-2026-10-25.md`). The website is the
landing page `/` and the phone mockup page `/prototype/*`.

When this is done:

- a visitor can switch the language from the page itself, without first finding the switch inside the phone;
- the page and the phone always show the same language;
- the page title, `<html lang>` and every visible string follow the language;
- a change to Polish copy can't leave a stale translation behind unnoticed.

## Where we are (checked 2026-10-28)

**Already done:**

- All website copy is in `apps/pwa/messages/<locale>/showcase.json`, in all 8 locales. The tagline and the
  disclaimer use `TAGLINES[locale]` and `UNOFFICIAL_DISCLAIMERS[locale]`.
- `src/platform/i18n.test.ts` fails on a missing key, an empty message or a changed ICU argument.
- The language is a setting (`settings:v1` → `locale`), and `settings.ts` sets `<html lang>`. `?lang=uk` in a
  link picks it and remembers it (`main.tsx`).
- `useFollowPhoneSettings` lets the page follow a language change made **inside the phone**.
- The Inter Tight subsets used by the showcase include Cyrillic (`compact-font.css`).

**Gaps:**

| #   | Gap                                                                                                                                    | Effect on a juror                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| G1  | The desktop header (`site-header.tsx`) has no language switch. The only switch is the globe inside the phone.                          | A non-Polish reader has to find a small control inside a mockup.          |
| G2  | Settings sync only goes one way: phone → page. Nothing makes the phone (an iframe) follow a change made on the page.                   | Once G1 exists, the page and the phone could show different languages.    |
| G3  | The landing page keeps the build-time Polish `<title>` from `index.html` (`%APP_TITLE%` from `TAGLINE`), even after a language switch. | The browser tab, screen readers and bookmarks stay in Polish.             |
| G4  | Static HTML is Polish only: `<html lang="pl">`, `meta description`, `<noscript>`.                                                      | Link previews and no-JS visitors see Polish. Minor.                       |
| G5  | Nothing detects **stale** translations. The test checks keys and arguments, not whether Polish changed after the translation was made. | A Polish rewrite (like today's hero rework) leaves other languages wrong. |
| G6  | The showcase E2E tests run only in Polish. Long languages (`de`, `lt`) and Cyrillic (`uk`, `be`) aren't checked on the desktop layout. | Overflow or broken wrapping in the hero, nav or feature cards.            |
| G7  | No glossary and no record of which language a native speaker has reviewed. The German register ("du" or "Sie") is still open.          | Inconsistent terms; we can't say which translations are checked.          |

## Phases

### Phase 0: wait for the hero rework (blocker)

Another session is reworking the showcase hero and its copy (uncommitted changes in
`apps/pwa/src/features/showcase/*`, `messages/*/showcase.json` and `e2e/showcase.spec.ts`). Start Phase 2 and
later only after that work is committed, or the edits will collide. Phase 1 doesn't touch those files and can
start now.

### Phase 1: translation pipeline (G5, G7)

Owners: `harness-engineer` (tool, CI), `language-engineer` (lock baseline, glossary, review tracker).

1. **Source lock.** Add `apps/pwa/messages/translations.lock.json`. For each locale and each key, it stores a
   short hash of the Polish text the translation was made from:
   `{ "uk": { "showcase.hero.lead": "a1b2c3d4" } }`. It also covers the brand strings in
   `packages/brand/src/copy.ts` (`TAGLINES`, `UNOFFICIAL_DISCLAIMERS`) as `brand.tagline` and
   `brand.disclaimer`.
2. **`tools/i18n/sync.mjs`**, run as `pnpm run i18n:check` and `pnpm run i18n:stamp`:
   - `check` lists, per locale, the keys that are **missing**, **stale** (the Polish hash changed) or
     **orphaned** (no longer in Polish). It exits 1 when any exist, so it can run in CI.
   - `stamp <locale> [keys…]` records the current Polish hash once a key is translated.
   - Tests with `node --test` in `tools/__tests__/`.
   - Added to `ci:quality`.
3. **Baseline.** Stamp every current translation once, so the pipeline starts green. Do this after Phase 0, so
   the new hero copy is translated first.
4. **Glossary** `docs/i18n/glossary.md`: one row per term, with columns for the 8 locales. It covers:
   - matter, application and office;
   - names kept in Polish with a gloss (PESEL, ZUS, mObywatel is not used);
   - the product name (never translated);
   - the informal "you" in each language.
5. **Review tracker** `docs/i18n/review-status.md`: per locale, who drafted it (machine or person), the native
   reviewer, the date and open questions. For German, it also records the "du" or "Sie" decision.

### Phase 2: language switch on the website (G1, G2)

Owners: `ui-engineer` (header control), `pwa-engineer` (settings sync), `service-designer` (Polish labels),
`language-engineer` (7 translations).

1. A globe button with the locale code in `SiteHeader`, matching the phone's header switch. It opens a list of
   the 8 languages:
   - each name is written in its own language with its own `lang` (`LOCALE_NAMES`);
   - the current one has `aria-current`;
   - each target is at least 48 px;
   - Escape closes the list and focus goes back to the button;
   - it works with the keyboard and a screen reader.
2. Choosing a language calls `updateSettings({ locale })`. The page re-renders through `IntlProvider` and
   `<html lang>` updates.
3. **Two-way sync.** The app inside the phone also listens for `storage` events on `settings:v1` (or the page
   posts a `sprawnie:settings` message, as with `sprawnie:navigate`). That way a change on the page updates
   the phone immediately, without a reload. Keep the existing origin and source checks.
4. Optional: write `?lang=<code>` into the address bar on switch, so a copied link opens in the same language.
   Only if the user wants it (open question 3).
5. New keys, e.g. `showcase.language.button` and `showcase.language.label`: Polish from `service-designer`,
   the other 7 from `language-engineer` in the same change.

### Phase 3: page metadata (G3, G4)

Owner: `pwa-engineer`.

1. **Landing title.** Set `document.title` on the landing page from a message (`showcase.pageTitle`) and
   update it on a language change. The mockup page already takes its title from the phone.
2. **No JS.** `<noscript>` shows a short line in all 8 languages, each with its own `lang`.
3. **Static meta stays Polish** (the jury is Polish, and the static HTML can't know the setting). Document
   this in the languages decision record.

### Phase 4: layout and fonts (G6)

Owner: `ui-engineer`.

1. Check the hero, nav, feature cards and disclaimer in `de` and `lt` at 1024, 1280 and 1440 px widths, and at
   200% text. Fix wrapping with layout, not shorter translations.
2. Check that the glyphs render in both the compact font and the body font, with no fallback boxes:
   - `be`: ў, і;
   - `uk`: ї, є, ґ;
   - `lt`: ą, ė, į, ų, ū;
   - `cs`/`sk`: ř, ů, ľ, ĺ, ŕ.

### Phase 5: tests (G6)

Owner: `qa-engineer`.

In `apps/pwa/e2e/showcase.spec.ts` (desktop Chrome and Safari projects), add a test for each of these:

- the header switch changes the page **and** the phone, and both persist after a reload;
- a language chosen inside the phone still updates the page (regression);
- `<html lang>` and `document.title` match the chosen language;
- axe finds no WCAG A/AA violations on the landing page in all 8 locales;
- no horizontal overflow at 1024 px in `de` and `lt`;
- `/?lang=be` opens the landing page in Belarusian.

### Phase 6: review and sign-off (G7)

1. `plain-language-editor` reviews the Polish source of the website.
2. `language-engineer` brings all 7 locales to "current" (`i18n:check` passes) and updates the review tracker.
3. A native speaker reads each language. Belarusian and Lithuanian first, as the languages decision record
   asks. These are people the user arranges; the agent prepares a short review sheet for each locale.
4. `code-reviewer` and `accessibility-auditor` review the diff before the PR.

## Acceptance criteria

- [ ] From the desktop landing page, a keyboard-only user switches to Ukrainian in at most 3 key presses after
      reaching the header. The page and the phone both show Ukrainian.
- [ ] `pnpm run i18n:check` passes, and CI fails when a Polish string changes without its translations.
- [ ] The tab title and `<html lang>` follow the language on the landing page.
- [ ] The showcase E2E tests pass in all 8 locales, including axe.
- [ ] `docs/i18n/review-status.md` shows the state of every locale.

## Open questions for the user

1. **First visit:** keep Polish for everyone (current decision), or show a small "Also in English /
   Українською …" hint when the browser language is one of ours? Never switch automatically.
2. **German register:** "du" (current, as in every other language) or "Sie"?
3. **Shareable links:** should switching the language write `?lang=` into the address bar?
4. **Native reviewers:** who checks each language, and by when? The submission deadline is 30.11.2026.

## Order and rough size

| Phase           | Can start     | Size                 |
| --------------- | ------------- | -------------------- |
| 1 Pipeline      | now           | ~½ day               |
| 2 Switch + sync | after Phase 0 | ~1 day               |
| 3 Metadata      | after Phase 0 | ~2 hours             |
| 4 Layout        | after Phase 2 | ~½ day               |
| 5 Tests         | alongside 2–4 | ~½ day               |
| 6 Review        | after 2–5     | depends on reviewers |
