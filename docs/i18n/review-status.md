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

## Outside the lock

These strings are translated but not tracked by `i18n:check`. Check them by hand when the Polish changes:

- the `<noscript>` lines in `apps/pwa/index.html` (one per language, each with its `lang`).

## Review sheet (for each reviewer)

1. Open `https://<production link>/?lang=<code>` on a laptop, then on a phone.
2. Read the landing page top to bottom, then the app in the phone: start screen, a document, Settings.
3. Note anything that sounds machine-made, too formal, wrong or unclear. Send a screenshot or the sentence and
   a better version.
4. Say whether the informal "you" feels right for a state service in your language.
