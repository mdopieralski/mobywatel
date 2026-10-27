---
title: Brand voice
owner: >-
  shared by section: §2 values product-manager; §3–§9, §11–§13 service-designer; §10 conversation-designer;
  §14 everyone. docs/product/ belongs to product-manager, so other owners edit with the user's OK.
status: draft, awaiting review
updated: 2026-10-24
applies_to:
  UI copy (apps/pwa/messages), assistant turns (packages/content/src/scenarios), notifications, confirmations,
  errors, the submission text
sources: see §15
---

# Brand voice

How the prototype speaks, for people and for agents. The look is in `visual-identity.md`. Grammar mechanics
(ICU plurals, pl-PL dates and money, message keys) are in the `plain-polish` skill.

**How to use this guide.**

- Rules are numbered (V1, T2, P3…) so reviews can cite them.
- Every rule has a ✅ / ❌ example in real Polish UI text.
- Rules marked **[auto]** can be checked by a script. The `plain-language-editor` agent checks the rest.
- When a rule and common sense disagree, choose the reader. "19 or 21 words" doesn't matter. "Will a senior
  understand this?" does.

## 1. Who we write for

**Default reader:** a 70-year-old on a phone with large text, in a hurry or worried, who doesn't know the
office words. If they understand it, everyone does.

We also write for:

- a parent between two other tasks;
- a screen-reader user who hears every word in order;
- a person with Polish as a second language (the `uk` locale comes later);
- a relative helping someone else ("ktoś mi pomaga");
- the jury, who compares us with the reference prototype in a few minutes.

## 2. Values

What we stand for. They shape the voice (§3) and the look (`visual-identity.md`). Each value has a test for
any screen.

| Value                                                | What it means                                                                                    | Test                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **Prosto** (simple)                                  | One action per screen. If we already know the answer, we skip the question.                      | Can a first-time user say what this screen is for in 5 seconds?             |
| **Z wyprzedzeniem** (one step ahead)                 | The app reminds, suggests and pre-fills. The person confirms instead of hunting.                 | Did the user type something the app already knew?                           |
| **Dla każdego** (for everyone)                       | Seniors, screen readers, shaky hands, second-language speakers, helpers. Senior mode is a view.  | Does it work at 360 px, in senior mode, with VoiceOver and a keyboard only? |
| **Twoje dane, Twoja decyzja** (your data, your call) | We say what data we use and why, share only what is needed, show who checked it, ask first.      | Is there a confirmation that says exactly what will happen?                 |
| **Uczciwie** (honest)                                | No dark patterns, no fake urgency, no pretending to be official. Fictional data looks fictional. | Could a juror mistake this for the real mObywatel or a real ID? Must be no. |

Where they come from: the challenge site's own language ("Mniej kroków, mniej druków", "Przypomnienia i
terminy", "Dla seniorów i dostępność", "Kto i kiedy sprawdzał moje dane?") and the brief
(`competition-brief.md`).

## 3. Voice

**In one sentence:** we speak like a calm, competent person at the counter who is on your side.

The voice stays the same everywhere. Only the tone changes (§4).

| Trait                                                       | Means                                                       | ✅                                             | ❌                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| **Konkretny, ale nie urzędowy** (concrete, not officialese) | Facts, dates, amounts and the next step, in everyday words. | Twój dowód jest ważny do 12.03.2027.           | Upływa termin ważności dokumentu tożsamości. |
| **Życzliwy, ale nie poufały** (kind, not chummy)            | Warm and respectful. No jokes, slang or emoji.              | Gotowe. Potwierdzenie jest w Twoich sprawach.  | Super! 🎉 Udało się!!!                       |
| **Pomocny, ale nie nachalny** (helpful, not pushy)          | Suggest the next step once. The person decides.             | Możesz od razu zamówić nowy dowód.             | Nie czekaj! Zamów nowy dowód już teraz!      |
| **Spokojny, ale nie bagatelizujący** (calm, not dismissive) | Take problems seriously without drama.                      | Zastrzeżemy dowód w minutę. Nikt go nie użyje. | Nie martw się, to nic takiego!               |
| **Szczery, ale nie oschły** (honest, not cold)              | Say what we can't do and what to do instead.                | W prototypie ta sprawa kończy się tutaj.       | Funkcja niedostępna.                         |

**Default tone settings** (NN/g's four dimensions): more serious than funny, between formal and casual,
respectful, matter-of-fact rather than enthusiastic. We never move to "funny" or "irreverent".

## 4. Tone map

The voice stays the same. How serious and how detailed we are depends on the situation and on how the person
feels.

| Situation                                | The person feels | Tone                                         | Example                                                                         |
| ---------------------------------------- | ---------------- | -------------------------------------------- | ------------------------------------------------------------------------------- |
| First open, start screen                 | curious, unsure  | welcoming, short, honest about the prototype | Sprawy urzędowe prościej. To nieoficjalny prototyp: dane są fikcyjne.           |
| Routine task (check a document)          | neutral          | brief, neutral                               | Prawo jazdy. Ważne do 05.06.2031.                                               |
| Deadline or reminder                     | slightly anxious | clear, concrete, one action                  | Przegląd auta za 11 dni (4.11). Umów wizytę.                                    |
| Confirmation before sending or paying    | careful          | serious, detailed, neutral                   | Wyślemy do urzędu gminy: imię, nazwisko, PESEL, nowy adres. Wysłać?             |
| Success                                  | relieved         | plain, short, what happens next              | Wniosek wysłany. Odpowiedź przyjdzie do 7 dni.                                  |
| Error caused by us or the network        | annoyed          | own it, give a way forward                   | Nie udało się wysłać. Sprawdź internet i spróbuj jeszcze raz. Dane są zapisane. |
| Error in what the person entered         | unsure           | supportive, specific, no blame               | Ta data już minęła. Wybierz dzień od 25.10.                                     |
| Empty state                              | neutral          | say why it's empty and what to do            | Nie masz jeszcze przypomnień. Dodamy je, gdy zbliży się termin.                 |
| Offline                                  | worried          | calm, what still works                       | Jesteś offline. Dokumenty i sprawy działają dalej.                              |
| Stressful matter (lost wallet, accident) | stressed         | calm, fast, steps in order                   | Zastrzeżmy najpierw dowód. To zajmie minutę.                                    |
| Sensitive matter (death in the family)   | grieving         | quiet, respectful, no promotion              | Przykro nam. Pokażemy, co trzeba załatwić i w jakiej kolejności.                |
| The assistant doesn't know               | unsure           | honest, offer alternatives                   | Tego jeszcze nie umiem. Mogę pokazać, gdzie to załatwić.                        |

Rules for tone:

- **T1.** The more consequences an action has (money, data, a submission), the more serious and detailed the
  text.
- **T2.** Routine success stays plain ("Zapisano"). Celebrate only real milestones, and quietly.
- **T3.** Don't tell people how to feel ("Nie martw się") unless you can say why they needn't worry.
- **T4.** Apologise only when we caused the problem, and only once.
- **T5.** No exclamation marks in errors, warnings or the assistant. **[auto]**

## 5. Address and grammar

- **A1. "Ty", everywhere, including senior mode.** mObywatel and gov.pl speak to people in the informal second
  person ("załatwisz swoje sprawy", "Nie musisz już nosić…"), and so does the challenge site. One register is
  easier to keep consistent. Never "Pan/Pani" or "Pan/i", and never third person ("użytkownik",
  "wnioskodawca", "klient"). **[auto]** for the listed words. ✅ Twój wniosek jest gotowy. ❌ Wniosek
  użytkownika jest gotowy.
- **A2. The app speaks as "my".** ✅ Wysłaliśmy wniosek. ❌ Wniosek został wysłany przez system.
- **A3. The assistant speaks as "ja" and avoids gendered past forms about itself.** Use the present or the
  future tense. ✅ Sprawdzam… / Już mam. ❌ Sprawdziłem.
- **A4. Gender of the reader.** When the persona is known, use their grammatical gender (from persona data).
  Otherwise use neutral forms: the present tense, the imperative, "możesz", or nouns. Never slashes.
  **[auto]** for `/aś`, `/łaś`, `(a)`. ✅ Zgubiony dowód? Zastrzeżemy go. ❌ Zgubiłeś/aś dowód?
- **A5. Active voice, personal verbs.** Avoid "-no/-to" forms, "zaleca się", and "-ąc / -wszy" participles. ✅
  Zapłać do 15.11. ❌ Opłatę należy uiścić w terminie.
- **A6. Say what to do, not what not to do.** ✅ Zapłać do 15.11. ❌ Nie spóźnij się z opłatą.

## 6. Plain-language rules

Based on ISO 24495-1 (relevant, findable, understandable, usable), "Prosty język – ustandaryzowane zasady"
(UW, Jasnopis and partners) and the Polish civil service's plain-language rules.

- **P1. Sentences up to 15 words, 20 at most.** One idea per sentence. **[auto]**
- **P2. Paragraphs up to 3 sentences on screens** (5 in longer help text). **[auto]**
- **P3. The most important thing comes first:** the answer, the date, the amount, the action.
- **P4. Verbs, not nouns.** ✅ żeby złożyć ❌ w celu złożenia. ✅ sprawdź ❌ dokonaj weryfikacji.
- **P5. Name the specific office, document or amount.** ✅ urząd gminy w Lublinie ❌ właściwy organ.
- **P6. Explain every abbreviation the first time,** except everyday ones (PESEL, OC, ZUS). ✅ CEIDG (rejestr
  firm) ❌ CEIDG.
- **P7. No legal citations in the UI.** Sources go behind "Skąd to wiemy?".
- **P8. No double negatives, no archaic or high-register words** (niniejszym, iż, bowiem, jednakże,
  przedmiotowy), and no buzzwords (dedykowany). **[auto]** via the word list.
- **P9. Titles up to 4 words. Buttons are verbs that say what will happen.** ✅ Zapłać 30 zł ❌ OK / Dalej
  (when the button sends or pays).
- **P10. Concrete dates and numbers in pl-PL format,** with relative time where it helps. ✅ za 11 dni (4.11)
  ❌ w najbliższym czasie.
- **P11. Readability target:** Jasnopis class 3 or lower ("tekst łatwy") for screens and the assistant. This
  is our own target; the research found no source that sets one. Use the score as a hint, not a gate.

## 7. Word list

One name per thing, everywhere: screens, assistant and submission text. The tables are meant to be parsed by a
future `tools/` lint (avoid → use).

**Our terms**

| Use                  | For                                                  | Not                                       |
| -------------------- | ---------------------------------------------------- | ----------------------------------------- |
| sprawa / sprawy      | a matter the person handles (meldunek, nowy dowód)   | usługa, proces, procedura                 |
| dokument / dokumenty | IDs and licences in the app                          | poświadczenie, mDokument                  |
| dowód                | the ID card (dowód osobisty in full on first use)    | dokument tożsamości                       |
| przypomnienie        | a deadline the app tells you about                   | powiadomienie (that is the system banner) |
| wniosek              | what is sent to an office                            | podanie, formularz (unless it really is)  |
| urząd                | the office (named: urząd gminy, wydział komunikacji) | organ, instytucja                         |
| asystent             | the conversational helper                            | bot, czat, AI (except in the disclosure)  |
| prototyp             | what this app is                                     | aplikacja rządowa, mObywatel              |
| dane fikcyjne        | the demo data                                        | dane testowe, przykładowe dane osobowe    |

**Avoid → use** (extend the `plain-polish` skill's table, don't duplicate it)

| Avoid                            | Use                                                      |
| -------------------------------- | -------------------------------------------------------- |
| dokonać zgłoszenia / weryfikacji | zgłosić / sprawdzić                                      |
| w celu                           | żeby                                                     |
| uprzejmie informujemy            | (drop it)                                                |
| niniejszym, iż, bowiem, jednakże | (drop) / że / bo / ale                                   |
| wnioskodawca, użytkownik, klient | Ty                                                       |
| właściwy organ                   | the office's name                                        |
| uiścić opłatę                    | zapłacić                                                 |
| termin ważności upływa           | ważny do                                                 |
| wystąpił błąd                    | nie udało się …                                          |
| dedykowany                       | dla, przeznaczony dla                                    |
| kliknij                          | wybierz / naciśnij (works for touch, keyboard and voice) |
| błąd krytyczny, nieprawidłowy    | say what is wrong and how to fix it                      |

## 8. Patterns

Use these templates. Words in `<…>` are filled per case.

- **Confirmation before acting** (anything that sends, pays, blocks or shares):
  - Heading: `<czasownik> <co>`, e.g. "Zastrzeżesz dowód ABC123456".
  - Rows: only the data that will be used, each with a plain label.
  - One line saying where it goes, what it costs, and how to undo it.
  - Primary button: repeats the action ("Zastrzeż dowód"). Secondary button: "Zmień" or "Anuluj".
- **Success:** a past-tense heading ("Dowód zastrzeżony"), the time, what happens next and when, and where to
  find the confirmation. In the prototype, add: "W prototypie nic nie zostało wysłane."
- **Error:** what happened → what to do now → reassurance that nothing was lost (only if true) → a way out.
  Never show raw error codes. ✅ Nie udało się zapłacić. Spróbuj jeszcze raz albo wybierz inną metodę. Twoje
  dane są zapisane.
- **Destructive action:** say what will be lost, in the heading. ✅ Usunąć wszystkie dane demo? Zaczniesz od
  nowa. Buttons: "Tak, usuń" / "Anuluj".
- **Empty state:** why it's empty, plus what will fill it or what to do.
- **Reminder:** what · when (date and "za N dni") · one action. ✅ OC auta kończy się za 14 dni (7.11). Odnów
  polisę.
- **Loading and offline:** say what's happening only if it takes more than about 1 second, and what still
  works offline.
- **Help text:** one sentence under the field, about the person's goal, not the field.

## 9. Inclusive and accessible language

- **I1.** Write about people, not conditions: "osoby z niepełnosprawnościami", not "niepełnosprawni". No
  "seniorzy sobie nie radzą". Senior mode is named "Tryb dla seniora" in settings, with no other value
  judgement.
- **I2.** Don't assume a family model, a car, a job or a smartphone skill level.
- **I3.** Text works when read aloud: no meaning carried only by emoji, arrows, colour or position ("kliknij
  po prawej"). Link text makes sense on its own. ✅ Zobacz, kto sprawdzał Twoje dane ❌ Kliknij tutaj.
- **I4.** Write numbers in a form screen readers read well: "30 zł", "12.03.2027", "za 11 dni". Don't use "→"
  inside sentences.
- **I5.** Easy-to-read: on key senior-mode screens, check against the Polish ETR recommendations (2026, see
  §15). Real ETR certification needs people with intellectual disabilities as proofreaders, which an agent
  can't replace.

## 10. The assistant

Owner: `conversation-designer`. The engine belongs to `assistant-engineer`.

**Persona.** A helpful guide inside the app: calm, concrete, patient, honest, brief. It has no human name, no
gender and no age, and it doesn't pretend to be a person or an official. The bar is mObywatel's own assistant,
which runs on PLLuM. According to secondary sources, it declines off-topic questions, asks follow-up questions
when something is unclear, warns that answers may need checking, and can't see case status. Ours does all that
and also acts, always with confirmation.

- **AS1. Disclose it is automated** at the first message, in one sentence (the fixed phrase in §11). This is
  required by the EU AI Act (Art. 50) from 2 August 2026, and it is honest.
- **AS2. One or two sentences per turn, one question per turn.** Offer up to 4 quick replies, verbs first.
  **[auto]**
- **AS3. Ground every fact.** Say where it comes from ("Według danych w Twoim profilu…", "Na gov.pl…"). Never
  invent a fee, a deadline or a rule. If unsure, say so and offer a way to check.
- **AS4. Confirm before acting** (pattern §8). Never act on an assumption. Ask when the request is ambiguous.
- **AS5. Fail gracefully.** "Tego jeszcze nie umiem" plus 2–3 options, including the screen path. Never a dead
  end.
- **AS6. Stay on topic.** Politely decline anything outside official matters, and offer what it can do. No
  opinions on politics, parties or people.
- **AS7. Speakable.** Every turn must make sense through text-to-speech and a screen reader: no tables, emoji
  or symbols, and numbers written as people say them.
- **AS8. Same words as the screens** (word list §7). The chat and the screens describe a matter the same way.
- **AS9. Never ask for real personal data.** If there is free text input, say it is a prototype.

✅ Jestem automatycznym asystentem, nie człowiekiem. Pomogę Ci załatwić sprawę. Od czego zaczynamy? ❌ Cześć!
Jestem Ania z mObywatela 😊 W czym mogę pomóc?

## 11. Fixed phrases

These must be identical everywhere. Quote them from code; never retype them.

| Phrase                   | Where it lives                                     | Text                                                                                                                |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Disclaimer               | `UNOFFICIAL_DISCLAIMER` in `@mobywatel/brand`      | Nieoficjalny prototyp na konkurs mobywatel.ai. To nie jest aplikacja mObywatel. Wszystkie osoby i dane są fikcyjne. |
| Watermark                | `DOCUMENT_WATERMARK`                               | PROTOTYP – nie jest dokumentem                                                                                      |
| Tagline                  | `TAGLINE`                                          | Sprawy urzędowe prościej                                                                                            |
| Assistant disclosure     | proposed: `ASSISTANT_DISCLOSURE` (not in code yet) | Jestem automatycznym asystentem, nie człowiekiem.                                                                   |
| After a simulated action | proposed: `common.prototypeNothingSent`            | W prototypie nic nie zostało wysłane.                                                                               |

Standard button labels: Dalej (only to move on, never to send) · Wróć · Anuluj · Zmień · Gotowe · Spróbuj
jeszcze raz.

## 12. Other languages

Polish is the source. The app also speaks English, Ukrainian, German, Czech, Slovak, Lithuanian and Belarusian
(`docs/decisions/languages-2026-10-25.md`), always complete for every screen (the `plain-polish` skill). What
must survive translation:

- the same register (informal "you": ти, ты, du, ty, tu);
- the same rules for confirmations, errors and the assistant;
- the disclaimer meaning, in full.

Allow about 30 % more length for translated text (German and Lithuanian run longest). Machine translation is
only a draft until a person checks it.

## 13. How we check

1. The writer self-checks against this guide (the owners in the frontmatter).
2. The `plain-language-editor` agent reviews new or changed copy and cites rule IDs.
3. **[auto]** rules: a planned `tools/` lint over `apps/pwa/messages/pl/*.json` and the scenarios, covering:
   - sentence length;
   - "!" in errors;
   - slashes for gender;
   - banned words from §7.

   The lint detects problems; people and agents fix them.

4. A Jasnopis score for key screens, as a hint (P11).
5. Before submission: read the demo path aloud in senior mode with a screen reader, and if possible test with
   one real senior and one relative-helper. Write the results in `docs/quality/`.

## 14. Open questions

1. **Senior mode register.** Keep "Ty" (recommended, A1), or switch to "Pan/Pani"? Switching doubles the copy
   and the tests.
2. **Assistant name.** None (recommended: no gender, no fake human), or a neutral name?
3. **Name and tagline.** "Sprawnie" is a working name pending a trademark check (`brand-designer`).
4. **Pitch wording.** Are the five value names good enough to use in the submission text?
5. **Readability target.** Is Jasnopis class 3 right for us, or should we use a stricter one for senior mode?
6. **Lint.** Should we build the [auto] lint now, or after the first matter is written?

## 15. Sources

Read 2026-10-24 unless noted.

- mobywatel.ai (tone, themes): https://mobywatel.ai/
- gov.pl mObywatel (evidence for the "Ty" register): https://www.gov.pl/web/mobywatel
- Prosty język – ustandaryzowane zasady (UW, Jasnopis and partners):
  https://www.uw.edu.pl/wp-content/uploads/2024/10/prosty-jezyk-%E2%80%93-standard.pdf
- Służba Cywilna, prosty język: https://www.gov.pl/web/sluzbacywilna/prosty-jezyk
- ISO 24495-1:2023 (published in Poland as PN-ISO 24495-1:2024-05, English only):
  https://www.iso.org/standard/78907.html
- Standardy tekstu łatwego do czytania i zrozumienia (ETR), 2026:
  https://niepelnosprawni.gov.pl/publikacja-opracowania-standardow-tekstu-latwego-do-czytania-i-zrozumienia-etr/
- Gender-neutral Polish: https://zaimki.pl/docs/pl/Poradnik%20j%C4%99zyka%20neutralnego%20p%C5%82ciowo.pdf
- NN/g, four dimensions of tone of voice: https://www.nngroup.com/articles/tone-of-voice-dimensions/
- Mailchimp voice and tone: https://styleguide.mailchimp.com/voice-and-tone/
- GOV.UK clear language:
  https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/
- Shopify Polaris voice and tone: https://shopify.dev/docs/apps/design/content/voice-and-tone
- Atlassian voice and tone, and its LLM-ready standards:
  https://atlassian.design/foundations/content/voice-tone, https://atlassian.design/llms-content.txt
- 18F voice and tone: https://guides.18f.org/content-guide/our-style/voice-and-tone/
- Google conversation design, persona:
  https://developers.google.com/assistant/conversation-design/create-a-persona
- Google PAIR, errors and failing gracefully: https://pair.withgoogle.com/chapter/errors-failing/
- GOV.UK Chat findings (over-trust in a government-branded assistant):
  https://insidegovuk.blog.gov.uk/2024/01/18/the-findings-of-our-first-generative-ai-experiment-gov-uk-chat/
- EU AI Act, Art. 50: https://artificialintelligenceact.eu/article/50/
- mObywatel assistant on PLLuM (secondary source, not verified in the app):
  https://ccnews.pl/2025/12/30/mobywatel-wdraza-wirtualnego-asystenta-opartego-na-modelu-pllum
