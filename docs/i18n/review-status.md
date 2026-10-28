# Translation review status

Which language a person has checked, and what is still open. Owner: the `language-engineer` agent. A
translation is a **machine draft** until a native speaker reads it. Never mark a locale reviewed without a
named person.

`pnpm run i18n:check` lists missing, stale and orphaned keys against the Polish source
(`apps/pwa/messages/translations.lock.json`). It passes as of 2026-10-28: every key in every language was
stamped as current against today's Polish.

| Locale | Drafted by       | Native reviewer | Reviewed on | Open questions                                     |
| ------ | ---------------- | --------------- | ----------- | -------------------------------------------------- |
| pl     | team (source)    | n/a             | n/a         | plain-language-editor review of the website copy   |
| en     | machine (Claude) | none yet        | no          |                                                    |
| uk     | machine (Claude) | none yet        | no          |                                                    |
| de     | machine (Claude) | none yet        | no          | "du" or "Sie" for a state service? Currently "du". |
| cs     | machine (Claude) | none yet        | no          |                                                    |
| sk     | machine (Claude) | none yet        | no          |                                                    |
| lt     | machine (Claude) | none yet        | no          | review first (languages decision record)           |
| be     | machine (Claude) | none yet        | no          | review first; official orthography (наркамаўка)    |

## Open notes per key

- `showcase.demo.*` (2026-10-28, machine draft, all 7 locales): video captions kept to about 60 characters.
  Persona name kept in Latin ("Katarzyna"); in uk, be and lt the cue `languages1` says "her neighbour" to
  avoid declining it. Łódź is an exonym in running text (uk/be Лодзь, lt Lodzė, cs/sk Lodž) but stays "Łódź"
  where it is what the screen shows.
- Register: older `showcase` keys (`hero.zus.body`, `tech.*`) use the plural/polite "you" in uk, cs, sk, lt,
  be ("ваш", "váš", "jūsų"); the new demo keys use the informal one. Native reviewers: flag which reads right.
- lt `nav.demo` is "Demo": "Demonstracija" wrapped the 6-link header at 1024 px (e2e). The section heading
  `demo.title` stays "Demonstracija".

## Notes for reviewers (2026-10-28, `zus` and showcase)

- All: `zus.offices.name` wraps an invented Polish nickname (kept in Polish) in the locale's quotes; en puts
  it before the noun ("“Pod Zegarem” office"). Check it reads naturally with a Polish name inside.
- de: "Stelle" / "ZUS-Stelle" for a ZUS branch; "Geschäftsstelle" may be more natural. ZUS takes "bei ZUS" in
  the flow but "bei der ZUS" in `showcase.new.zus.body` (existing): pick one.
- cs, sk: the action buttons are "Objednat se" / "Objednať sa" (no object); check it is clear on its own.
- lt: "Registruotis" as the button, "{date} duomenimis." for "Stan na".
- uk, be: "Записатися" / "Запісацца" as the button; "Візит заплановано" vs "Візіт запісаны" for the result.
- uk, cs, sk, lt, be: the `categories` matter descriptions use the formal "you" (vy, ви, jūs, вы), unlike the
  rest of the UI. Not changed in this pass; align with the glossary register in a separate change.

## Outside the lock

These strings are translated but not tracked by `i18n:check`. Check them by hand when the Polish changes:

- the `<noscript>` lines in `apps/pwa/index.html` (one per language, each with its `lang`).

## Review sheet (for each reviewer)

1. Open `https://<production link>/?lang=<code>` on a laptop, then on a phone.
2. Read the landing page top to bottom, then the app in the phone: start screen, a document, Settings.
3. Note anything that sounds machine-made, too formal, wrong or unclear. Send a screenshot or the sentence and
   a better version.
4. Say whether the informal "you" feels right for a state service in your language.
