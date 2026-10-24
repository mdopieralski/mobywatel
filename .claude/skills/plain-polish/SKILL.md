---
name: plain-polish
description: >-
  Writing UI and assistant copy in plain Polish (prosty język) and managing the message catalogue: rules,
  officialese → plain replacements, apps/pwa/messages structure, ICU plurals, pl-PL dates and money,
  confirmation and error wording, assistant tone, en/uk secondary languages. Use when writing or reviewing any
  user-facing text, adding a message key, or for "copy", "tekst", "prosty język".
---

# Plain Polish

Owner of the words: the `service-designer` agent. Engineers add keys; the wording is reviewed by the
`service-designer` agent before merge. Plain language is part of accessibility (the `accessibility` skill) and
a direct answer to "simpler" in the brief.

## Writing rules (zasady prostego języka)

1. **Short sentences.** ≤ 15 words is the target, 20 the hard limit. One idea per sentence.
2. **"Ty" form, active voice.** "Złożysz wniosek tutaj", not "Wniosek może zostać złożony".
3. **The verb comes first in buttons.** "Zapłać 210 zł", "Zastrzeż dowód", "Pokaż szczegóły".
4. **The answer first, then the details.** "Twój dowód jest ważny do 05.12.2026. Nowy zamówisz tutaj."
5. **Numbers and dates are concrete.** "za 11 dni (29.10)", not "w najbliższym czasie".
6. **No officialese, no legal citations in the UI.** Put the source in a "Skąd to wiemy?" link.
7. **Name things the way people do.** "dowód", "meldunek", "OC", "800 plus", not legal names (the legal name
   may appear once, in brackets).
8. **One action per screen** in matters. Optional things are clearly optional.
9. **No blame in errors.** Say what happened, what to do, and that nothing was lost.
10. **Gender-neutral where possible.** Use the persona's gender when known ("Zgubiłaś/Zgubiłeś" from persona
    data, never "Zgubiłeś/aś").

## Officialese → plain

| Urzędowo                        | Prosto                                      |
| ------------------------------- | ------------------------------------------- |
| Dokonaj zgłoszenia              | Zgłoś                                       |
| W celu złożenia wniosku należy… | Żeby złożyć wniosek, …                      |
| Uprzejmie informujemy, że…      | (drop it)                                   |
| Wnioskodawca                    | Ty                                          |
| Organ właściwy                  | urząd gminy / wydział komunikacji (name it) |
| Zameldowanie na pobyt stały     | meldunek (na stałe)                         |
| Uiszczenie opłaty               | zapłata, zapłać                             |
| Niniejszym potwierdzam          | Potwierdzam                                 |
| W przypadku braku…              | Jeśli nie masz…                             |
| Termin ważności upływa          | Ważny do                                    |
| Wystąpił błąd                   | Nie udało się … Spróbuj jeszcze raz.        |

## Confirmation wording (before anything is "sent")

- Heading = the action and its object: "Zastrzeżesz dowód ABC PRO123".
- Rows = only the data that will be used, each with a plain label.
- One sentence on consequences and undo: "Możesz to cofnąć w aplikacji w ciągu 14 dni."
- Buttons: primary repeats the action ("Zastrzeż dowód"), secondary "Zmień" or "Anuluj".
- After the action: a past-tense heading ("Dowód zastrzeżony"), time, what happens next.
- Always end with the prototype reminder where it matters: "W prototypie nic nie zostało wysłane."

## Message catalogue

- `apps/pwa/messages/pl/<namespace>.json`, one namespace per feature: `common`, `home`, `documents`,
  `assistant`, `reminders`, `privacy`, `settings`, `matters.<matter>`.
- Keys are semantic (`documents.validUntil`), never the text itself. Polish is the source; other locales
  mirror the keys.
- ICU MessageFormat. Polish plurals need `one`, `few`, `many` and `other`:

```json
{
  "reminders.dueIn": "{days, plural, one {za # dzień} few {za # dni} many {za # dni} other {za # dnia}}"
}
```

- Format dates, money and numbers with `Intl` in `pl-PL` at the app edge (`src/platform/i18n`): `21.11.2026`,
  `1 926,76 zł` (non-breaking spaces). Components receive formatted strings.
- No text inside components or `packages/ui`. Scenario text for the assistant lives in `packages/content`
  (same rules).
- The i18n library is the scaffold's choice (the `scaffold-app` skill). It must support ICU plurals.

## Secondary languages

- `en` and `uk` (Ukrainian speakers are a large group of residents) are a plus for "more accessible". Ship
  them only when complete for the flows shown in the demo. A half-translated screen is worse than none.
- Machine translation is allowed as a draft. Mark it in the PR, and have a person check before submission.

## Assistant tone

- Calm, warm and brief. 1–3 sentences per turn, then options (chips) or a card.
- Says what it will do before doing it. Never claims to have sent anything without a confirmation.
- Admits limits plainly: "Tego nie załatwię w aplikacji. Możesz to zrobić w urzędzie gminy."
- Never invents fees, deadlines or law. If the content package has no source, it says so (the `ai-assistant`
  skill).

## Review checklist

Read it aloud. Would a 70-year-old understand it the first time? Can the button text stand alone? Is every
number concrete and every date formatted? Is the persona's gender right? Does it work at 200% zoom without
truncation?
