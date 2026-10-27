---
title: Reference prototype – deep analysis
owner: product-manager
status: draft for review
updated: 2026-10-25
sources:
  - mobywatel-ai.zip from mobywatel.ai (code dated 2026-10-23, knowledge base 2026-10-18)
  - static run of mockup/ in script mode (the public web version's behaviour), iPhone 13 / Pixel 7 / 1440×900
  - code read of serwer/ (not executed: it reads API keys from the macOS Keychain)
  - axe 4.x WCAG 2.2 A/AA, keyboard and zoom probes, Playwright scripts
  - fact-check of 16 legal/procedural claims against gov.pl and other sources (2026-10-25)
---

# Reference prototype – deep analysis

The bar we must beat. Read with `competition-brief.md`. Everything below was measured or read in the code
unless marked _unverified_.

## TL;DR

1. **It is two products.**
   - The jury opens a **scripted web version**: 9 regex-routed scripts, no AI, no voice (the mic is fake).
   - The impressive part is a Python server with 66 tools and an LLM. It needs paid API keys and has no
     protection, so it is not what jurors click.
2. **Three of four personas are broken in the web version.**
   - **6 of 20** suggested prompts end in "Tego w tej wersji jeszcze nie załatwię".
   - **All 12** reminder tiles of Jan, Ewa and Kacper open **Marta's** data. For example, Ewa (Lublin) renews
     her ID on a form for "Marta Kowalska, Urząd Dzielnicy Mokotów".
3. **Accessibility is shallow.**
   - axe violations on every screen.
   - Text ignores the user's font size (all `px`), and the layout breaks or clips at 150–200 % zoom.
   - Dialogs don't manage focus, and focus falls to `<body>` mid-matter.
   - No headings or landmarks, no senior mode, no dark mode, 38–40 px targets.
4. **It doesn't work offline and can't be installed.** No manifest, no service worker; Google Fonts loads from
   outside.
5. **The content is mostly right.** 11 of 16 claims check out, but there is **one error in the flagship
   lost-wallet flow**: it says the driving licence can't be blocked in the app, and it can. One fee is out of
   date.
6. **What it does well, and we must match:**
   - confirmation cards with prefilled data and a source line;
   - the zastrzec / zablokować / unieważnić distinctions;
   - reversible vs irreversible steps;
   - a proactive "Do załatwienia" list;
   - short, warm copy.

Our winning line: **the same matters, working for every persona, without AI keys, offline, for seniors and
screen-reader users, and correct**, with numbers to prove it.

## 1. What it is

| Layer             | Web version (what the jury sees)                                              | Full version (download, "run it yourself")                                                                            |
| ----------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Front end         | `mockup/`, plain HTML/JS, about 1,300 lines, no build, no tests               | same                                                                                                                  |
| Brain             | `scenarios.js`: regex `route()` → 9 scripts + fallback                        | `serwer/agent.py`: LLM tool loop (OpenAI Responses default, Anthropic, or any OpenAI-compatible such as Bielik/PLLuM) |
| Tools             | none                                                                          | **66**: 33 reads, 27 actions (each behind a confirm card), 6 UI tools                                                 |
| Knowledge         | none                                                                          | 1,844 gov.pl / biznes.gov.pl cards, 22.7k chunks, hand-written BM25, 62 MB in RAM                                     |
| Voice             | fake: the mic always sends "Miałam stłuczkę na parkingu" after 1.6 s          | cloud STT/TTS (ElevenLabs → OpenAI), RMS end-of-speech detection                                                      |
| Languages         | 16 UI languages, dictionaries served by the server (`/api/i18n.js`)           | plus 2 extra LLM calls per turn to translate the conversation                                                         |
| "Znak" hand-off   | animated token, camera scanner, `komputer.html` demo counterpart ("Autoplus") | in-memory token exchange on the server                                                                                |
| Offline / install | **no**: no manifest, no service worker                                        | no                                                                                                                    |

Page weight is small: 19 requests, about 170 KB, under 1 s on localhost. That is a strength we must not lose
against.

## 2. What a juror sees (web version, default persona Marta)

- **Start:**
  - A wallet stack of 4 document cards in the official mObywatel artwork, with the eagle, real-looking photos
    and "mDowód".
  - One reminder ("Pismo z Urzędu Skarbowego · i 2 inne sprawy").
  - A prompt "Co chcesz załatwić?".
  - Header icons: QR "znak", inbox, bell.
- **Focusing the prompt** switches to chat with 5 suggestions and a promise: "Zanim cokolwiek wyślę, poproszę
  o potwierdzenie".
- **The scripted matters:**
  - lost wallet (block, suspend 14 days, invalidate, new ID, PESEL);
  - collision (mStłuczka via the znak);
  - used car (history, fake photo OCR, PCC, contract);
  - newborn (USC, 800+, KDR);
  - phishing SMS (CERT);
  - the to-do list: tax-office letter reply, OC reminder, property-tax payment;
  - penalty points, ID validity, KDR partners.
- **Actions** end on a confirm card (data rows, source, "Anuluj" and the action). A fake "Face ID" overlay
  plays for 1.45 s, then a result card with a made-up number.
- **Taps to block a lost ID:** about 5 (focus the prompt, the suggestion, "Dowód osobisty", "Dalej", "Zastrzeż
  i zablokuj"). That is efficient. We have to match it, not just claim it.

## 3. Findings

### A. Personas break outside the default (measured, script mode)

The scripts hard-code Marta's data (`scenarios.js`), but `osoby.js` gives each persona its own suggestions and
tiles.

| Persona         | Suggestions OK | Suggestions → fallback                                                                     | Suggestions with wrong data                                               | Tiles with someone else's data                                  |
| --------------- | -------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Marta (Warsaw)  | 5/5            | 0                                                                                          | 0                                                                         | 0/3                                                             |
| Jan (Kraków)    | 2/5            | 3 ("Co chce ode mnie Urząd Skarbowy?", "odblokować PESEL", "Jedziemy z dziećmi do Egiptu") | 0                                                                         | 4/4 (VAT summons → Marta's PIT letter, Transporter OC → Toyota) |
| Ewa (Lublin)    | 2/5            | 2 (pension, mother's prescriptions)                                                        | "Mój dowód traci ważność" says valid until 2031 (hers expires 05.12.2026) | 4/4 (ID renewal on Marta's name and office)                     |
| Kacper (Gdańsk) | 3/5            | 1 (voting in Gdańsk)                                                                       | points: shows Marta's 5 points / limit 24 (his are 3 / 20, novice)        | 4/4 (fine → property tax via Apple Pay)                         |

A juror who switches persona sees this within a minute. **Our rule: every persona-specific prompt and tile
works, with that persona's data, and an E2E test proves it.**

### B. Accessibility (axe + keyboard + zoom; full table in the audit notes)

- **axe:** 2–4 violated rules on every screen and viewport.
  - `aria-required-children` (critical): a `role=menu` made of plain buttons.
  - `nested-interactive`: "Pokaż dane" sits inside the card button.
  - `label-content-name-mismatch` ×5–9.
  - Contrast 3.26:1 on placeholders and source lines.
- **Zoom and text size** (WCAG 1.4.4 / 1.4.10):
  - All type is in `px` (179 rules, 0 `rem`, down to 11–12 px for sources and 7 px plate labels).
  - Setting the root font to 200 % changes nothing.
  - The layout is absolutely positioned in JS: at 200 % "Dokumenty" overlaps the header icons.
  - On desktop, the fixed 390×844 frame clips its header off-screen at 150 %+.
- **Focus:**
  - Sheets (`#detail`, `#todo`) don't take or trap focus. Escape leaves focus on a hidden element.
  - After a chip or confirm button, focus falls to `<body>`.
  - Focusing the prompt changes the whole screen (3.2.1).
  - 5 of the first 18 Tab stops are invisible.
- **Screen reader:**
  - No `h1`, no `main`, the title is always "mObywatel".
  - The whole conversation is one `aria-live` region (typing dots, buttons and sources included).
  - The Face ID overlay is `aria-hidden`.
  - The reminder button's name drops its deadline ("Do załatwienia: 3 sprawy").
- **Seniors:** no senior or large-text mode, no dark mode. Targets are 38–40 px; only the confirm buttons
  reach 48 px.
- **Other:**
  - Received data auto-closes after 3:00 with no way to extend (2.2.1).
  - The QR flow is camera-only.
  - Script-mode voice "hears" words the user never said.
- **Fair credit:**
  - visible focus outline;
  - `prefers-reduced-motion` in CSS;
  - Polish `aria-label`s on icon buttons;
  - 48 px confirm buttons;
  - short copy.

### C. Content accuracy (16 claims fact-checked, 2026-10-25)

11 are correct, 3 partly correct, 1 wrong and 1 out of date.

- **Wrong (#4, flagship flow):** "Prawa jazdy nie zastrzeżesz w aplikacji". In fact, mObywatel's "Zastrzeż
  dokument" covers the ID card, passport **and driving licence**. A replacement licence costs 100 zł + 0.50 zł
  registration fee.
- **Out of date (#5):** a duplicate KDR card costs **17 zł from 1.03.2026** (Monitor Polski 2026 poz. 235),
  not 16 zł.
- **Missing conditions:**
  - Suspension only works for e-dowody issued after 4.03.2019 and needs an e-Doręczenia inbox.
  - The automatic PESEL reservation applies to adults and can be withdrawn.
  - Penalty points: 24 points means a re-test for experienced drivers. The novice 20-point rule is right.
    Expiry also runs from a final court ruling.
  - PCC: the exemption depends on the sale falling under VAT, not on an invoice, and there is also the ≤1000
    zł exemption.
- **Correct and worth matching:** the 14-day suspension then auto-invalidation; 828 828 828; the PESEL check
  required since 1.06.2024; 30 days to give fingerprints; mStłuczka conditions; 21 days to report a birth;
  800+ from birth if applied within 3 months; SMS to 8080; the Saturday deadline rule.

**Our rule: every fact on a screen carries a source and a "checked on" date** (they show the registry name but
never the gov.pl link). Fees that change yearly carry a "from" date.

### D. Full version (server): capability, cost, risk

- **Breadth:**
  - 13 matters run end to end, behind 27 action tools.
  - Business-rule guards return refusals instead of cards: adult passport in person only, leased car can't be
    reported sold, PCC ≤ 1000 zł, the voting-change window.
  - 19 more matters are explain-only (`gdzie_zalatwic`): registering residence, vehicle registration,
    marriage, death, PIT and others.
- **Shallow results:**
  - Nothing ever lands in the inbox (`skrzynka` is static).
  - `ustaw_przypomnienie` stores nothing.
  - Confirmation numbers are hard-coded and the same for everyone.
- **Fake registries are "too kind":**
  - any unknown plate → "OC ważne";
  - any driver → valid licence;
  - air quality always "dobra".
- **Cost and latency:**
  - About 10k fixed tokens per call (3.5–4k system prompt + 5–6k tool definitions).
  - The whole history is resent every turn, plus raw knowledge-base dumps.
  - Non-Polish turns add 2 more sequential LLM calls.
  - A "Już sprawdzam" filler sound covers the delay.
- **Security and privacy** (fine for localhost, not for a public demo):
  - No auth or rate limit.
  - The client sends the whole history, assistant and tool turns included, so a forged history plus `confirm`
    runs any action. Face ID is a UI-only gate.
  - A plaintext `agent.log` records every message, STT transcript and full tool input.
  - Audio goes to ElevenLabs or OpenAI.
  - API keys are read from the macOS Keychain.
- **Data hygiene:**
  - Generated PESELs and a NIP have **valid checksums**.
  - Real hospitals, schools and streets; phone numbers that could be real subscribers; a real university email
    domain.
  - The front end ships the **official marks**: the eagle, mObywatel logos, document artwork,
    `mdowod-ekran.png` and stock photos of people. Its own licence excludes all of these.
- **Prompt:**
  - Good rules: "data only from tools, don't guess, one action at a time, card instead of asking".
  - Written in the feminine with a masculine override; no neutral option.
  - Citations are never shown to the user.

### E. Languages

- **Their coverage:** 16 UI languages, 1,988 keys each, so the UI catalogues are complete.
  - The web version depends on the server for dictionaries. Our static copy with `?lang=uk` set `lang="uk"`
    but stayed Polish (_their public site unverified_).
  - Card text falls back to Polish when the dictionary misses.
  - The conversation is only translated with an OpenAI key.
- **Their gaps:** no Belarusian, Lithuanian or Russian.
- **Our position:**
  - Our 8 languages are bundled and offline, and a unit test enforces completeness.
  - We cover **be** and **lt**, which they don't.
  - They cover more Western EU languages; we shouldn't compete on count.

## 4. What we must match (their strengths)

1. **Confirm before acting:**
   - a card with prefilled data rows, the source, "Anuluj" and a verb on the button;
   - "Nic nie zostało wysłane" after cancelling;
   - one action at a time.
2. **Domain precision:**
   - the three different words (zastrzec / zablokować / unieważnić);
   - reversible vs irreversible steps stated plainly;
   - the in-person-visit caveats (fingerprints within 30 days).
3. **Proactive "Do załatwienia"** with deadlines, and reminders offered after each matter.
4. **Once-only data:** name, office, vehicle, account and family are prefilled on every card.
5. **Low effort to start:** 5 labelled suggestions with a sub-label each.
6. **Short, warm copy** in the informal "Ty".
7. **Privacy touches:** "Pokaż dane" hides the ID details by default.
8. **A path to a live model** (Bielik/PLLuM via an OpenAI-compatible endpoint).
9. **Light and fast:** about 170 KB.

## 5. Where we win: commitments for the pitch

Each one needs an E2E test or a measurement, so the submission text can state it as fact.

| #   | Claim we will be able to make                                                                          | Their measured state                           | How we prove it                                |
| --- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------- |
| W1  | Every persona's prompts and tiles work with that persona's data                                        | 6/20 dead ends, 12/12 tiles wrong              | E2E: every persona × every tile and suggestion |
| W2  | Works offline after the first load and installs on the home screen                                     | no SW, no manifest                             | offline E2E (we already have it)               |
| W3  | Follows the phone's text size; senior mode with 56 px targets                                          | px-only, no senior mode, 38–40 px              | E2E at 200 % root font; target-size check      |
| W4  | 200 % zoom and 320 px with no overlap or clipping                                                      | overlap at 200 %, clipped frame at 150 %       | E2E reflow checks                              |
| W5  | Zero axe violations on every screen, in every language and in senior mode                              | 2–4 rules on every screen                      | axe in E2E (we already run it)                 |
| W6  | Screen-reader journey: focus to the new step, a log role for chat, an announced result                 | focus falls to body; one huge live region      | E2E focus assertions + VoiceOver script        |
| W7  | Every fact has a source and a checked-on date                                                          | registry name only; 1 wrong, 1 outdated        | content lint: no fact without a source         |
| W8  | Full experience without any API key; the LLM is optional                                               | AI only with paid keys; the web is scripted    | demo works with the network off                |
| W9  | Not dressed as the state                                                                               | eagle, official cards, photos                  | guardrails audit                               |
| W10 | Clear choices as well as chat (seniors and screen-reader users)                                        | chat-first; focus on the prompt hijacks screen | journey step counts per matter, theirs vs ours |
| W11 | Results that persist: the letter in the inbox, the reminder in reminders, the matter in "Twoje sprawy" | nothing persists                               | E2E reload after a matter                      |
| W12 | Languages offline, including Belarusian and Lithuanian                                                 | server-dependent, no be/lt                     | i18n test + offline E2E in uk                  |

Step-count evidence for the form ("today N, reference M, ours K") is still to do. The service-designer should
count steps for lost wallet, ID renewal and newborn in both prototypes.

## 6. Not verified

- **Their live AI version:** not run, because it needs keys and reads the Keychain. Conversation quality,
  latency and tool-choice accuracy are unknown.
- **Their public site:** server-side i18n and whether it uses the agent.
- **Assistive tech and devices:** real VoiceOver or TalkBack and real phones (the measurements are Playwright
  emulation); Android system font scaling.
- **Other:** `komputer.html` beyond its title; the 8–55 contrast nodes per screen where text sits over card
  artwork; whether a 12-point probation rule for novice drivers is in force (announced for 3.03.2026).

## 7. Evidence

The raw evidence is temporary (session scratchpad): Playwright probe scripts, axe JSON, screenshots, and the
JSON from the persona and tile runs. The tables above quote it. To reproduce:

1. Unzip `mobywatel-ai.zip`.
2. Serve `mockup/` statically. Don't run `serwer/`.
3. Open `index.html?osoba=ewa`, tap the reminder, then "Dowód traci ważność".
