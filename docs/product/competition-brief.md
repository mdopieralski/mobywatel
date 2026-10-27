---
title: mObywatel Challenge — competition brief
owner: product-manager
status: current
verified: 2026-10-24
sources:
  - https://mobywatel.ai/ (read 2026-10-24)
  - https://mobywatel.ai/pobierz/mobywatel-ai.zip (reference prototype README, read 2026-10-24)
---

# mObywatel Challenge: competition brief

These are facts from the competition site and the reference prototype, as read on **2026-10-24**. Re-check the
site before quoting them in the submission.

## The challenge

- **Organiser:** Klub Parlamentarny Rozwój Plus. Honorary patron: Marcin Horała, Vice-Marshal of the Sejm. It
  is **not** an official government programme. mobywatel.ai is an independent prototype.
- **Goal:** design a clickable prototype of a mObywatel app that beats the prototype by Janusz Cieszyński
  (former Minister of Digital Affairs). His prototype handles official matters through a conversation with an
  AI assistant. Entries should be **simpler, more convenient, more accessible, or handle more matters**.
- **Reward:** the top 10 concepts are presented in the Sejm. No other prizes are named.
- **Deadline:** **30.11.2026**, end of day, Polish time. ⚠ On 2026-10-24 the page also showed "Nabór
  zakończony" (submissions closed). Confirm with the organisers that entries are still open.

## What counts as an entry

- A **clickable prototype** that can be walked through, covering screens and whole processes. Images, sketches
  or a video alone are not enough. A video is welcome as an extra link.
- It opens from an **`https://` link without login** and stays available until the results.
- Any tool is allowed (Figma, Framer, no-code, own website, a browser app). We build a PWA.
- More than one concept may be submitted, each as a separate entry. Rights stay with the authors.

## Submission form

Name or team name · email · city · submitter category · **concept title** · **description (30–4000
characters)** · **prototype link (https)** · optional extra link (video) · optional Polish technologies used ·
optional website. Consent to the rules. Consent to publish the title, link and name is needed only if
selected.

## Suggested areas (not mandatory)

1. A new mObywatel app: home screen, documents, navigation.
2. One matter end to end with fewer steps and forms: registration of residence (meldunek), a new ID card,
   vehicle registration, the 800+ benefit.
3. An assistant that handles matters by voice or text and **asks for confirmation before sending**.
4. Seniors and accessibility: large text, plain language, screen readers, **help from a relative**.
5. Reminders and deadlines: expiring ID, car insurance (OC), technical inspection.
6. Privacy and data control: **who checked my data**, sharing only what is needed.
7. Polish language models (Bielik, PLLuM) or Polish companies' technology are a plus.

## Judging

No scoring criteria are published. The bar is the reference prototype. The form asks **what works better in
your version and who it helps**. Our pitch must answer that with evidence (e.g. "steps to register residence:
today N, reference M, ours K").

## The reference prototype (what we must beat)

From the downloadable package (MIT code; see exclusions below):

- The assistant **replaces menus and forms**. You talk to it by text or voice. It checks (fictional)
  registries and handles matters, and every action is confirmed on a card.
- The web version runs **scripted scenarios** without live AI. The full version is a Python server with tool
  calling (dozens of tools), speech-to-text, text-to-speech, translation into 15 languages, and a local
  knowledge base built from gov.pl service pages.
- **Four fictional personas** (a mother in Warsaw, a business owner in Kraków, a teacher caring for her mother
  in Lublin, a student in Gdańsk), each with documents, reminder tiles and suggested prompts ("Zgubiłam
  portfel", "Miałam stłuczkę", "Mój dowód traci ważność").
- A "komputer" screen for handing data over with a code.

Measured weak spots and strengths: `reference-analysis.md` (2026-10-25). The first guesses were:

- A chat-first interface hides what the app can do. Seniors and screen-reader users may prefer clear choices
  to an empty prompt.
- It depends on a paid LLM for the full experience. Its web version is scripted.
- Accessibility (senior mode, help from a relative) and data control (who checked my data) are only lightly
  covered.

## Licence exclusions (binding for us)

The MIT licence of the reference **does not cover**: the coat of arms of the Republic of Poland, the mObywatel
name, logo and markings, the look of official documents (e.g. `icon-mobywatel.svg`, `logo-mobywatel*`,
`card-*`, `strip-*`, `mdowod-ekran.png`), photos of people (`foto-*.jpg`), and the gov.pl service descriptions
(check gov.pl terms before reuse). We use none of the image assets. See the `prototype-guardrails` skill.
