# Demo: a video made with Remotion

Status: **built (v1), 2026-10-28.** The whole team brainstormed it (15 agents); the build followed this plan
with the recommended defaults: proposal screens allowed with the badge, no voice-over, the MP4 in our own
deploy, "Mobilny ZUS" as plain text. Decisions still open for the user are at the end.

What was built:

- `apps/video` (Remotion 4.0.539): the composition `demo` (the page; no burned-in captions) and `demo-napisy`
  (Polish captions burned in, for the form). The app screens are drawn from the app's own catalogues and
  icons.
- `packages/content/src/demo-video.ts`: the timeline (chapters, captions, proposal stretches). The video and
  the page both read it.
- `apps/pwa/src/features/showcase/demo-section.tsx`: the "Demo" section after "Prototyp". It has the chapter
  buttons, a "Pokaż …" link per chapter that opens the screen in the phone, captions in the page language
  (text tracks), and a text version of the whole film.
- `pnpm run render:demo` writes `apps/pwa/public/video/demo-v1.mp4` (1.8 MB, silent) and its poster. They are
  never precached. On the first play the page stores the whole file once, so it then plays (and seeks)
  offline.

## 1. The idea in one paragraph

An **80-second** video called "Jeden dzień z aplikacją". It follows fictional **Katarzyna** (the persona the
app always shows) through one day, with one moment for each core proposal:

- **Mobilny ZUS** in the morning.
- **Bilety miejskie** on the way to another city.
- **Języki sąsiedzkie** in the evening, when her Ukrainian-speaking neighbour uses the same app in Ukrainian.

It sits in a new **"Demo"** section right after "Prototyp", with a header link. It has three chapter buttons.
Each chapter has a "Wypróbuj w prototypie" link that opens the matching screen in the phone above.

The message to land: **one app, in your language, no extra apps.**

## 2. Honesty rules (the biggest risk)

The ZUS matters are not built (they show "Wkrótce"). City tickets go only as far as the city picker.

- **Show the real screen first**, including its "Wkrótce", and only then the proposal.
- Every frame of a proposal gets **one consistent badge "Propozycja · jeszcze nie działa"** and a different
  frame style (a dashed outline). Live and proposed footage can never be confused.
- Wording: "proponujemy", never "możesz już". Every flow that "sends" something ends with "W prototypie nic
  nie zostało wysłane / zapłacone."
- A **"PROTOTYP · nieoficjalny"** badge is burned into a corner of every frame, so even a cropped clip carries
  it. The full `UNOFFICIAL_DISCLAIMER` shows for at least 4 s at the start and at the end.
- **No marks:** "ZUS" only as plain text in our font, no ZUS green, no logo. A generic tram icon, "Linia 7",
  no operator names or colours. The ticket is our neutral card with `DOCUMENT_WATERMARK` and a pattern that
  can't be scanned, never a QR code.
- **Safe claims:** no login; 8 complete languages, offline; 969 cities, searchable without Polish letters and
  without internet.
- **Unsafe claims:** buying tickets; any real ZUS data; "every city"; "more languages than the reference" (it
  has 16, so we say _complete, offline, including lt and be_); "replaces app X"; step counts for today's way
  until they are sourced.

## 3. Storyboard (80 s, 16:9, 1920×1080, 30 fps; exact times in `demo-video.ts`)

| Time  | Chapter                | What we see                                                                                                                                                                                                                                                                                       | Caption (PL, ≤ 8 words)                                       |
| ----- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 0–6   | Intro                  | Our tile and name, tagline, the disclaimer                                                                                                                                                                                                                                                        | "Sprawy urzędowe prościej. Nieoficjalny prototyp."            |
| 6–28  | **Mobilny ZUS** (rano) | Real: Start → ZUS → the matter list → "Wkrótce". Proposal: contributions at a glance ("za wrzesień: wpłacona"), then **Wizyta w ZUS**: pick a topic → a slot (an office suggested from the address we already have) → ConfirmCard "Umówisz wizytę 4.11, 10:30" → "Przypomnimy Ci dzień wcześniej" | "ZUS obok innych spraw." / "Zanim cokolwiek wyślemy, pytamy." |
| 28–48 | **Bilety** (w drodze)  | Real: Podróż → Bilet miejski → type "lodz" → Łódź found, offline. Proposal: ticket type → ConfirmCard "Kupisz bilet 24-godzinny w Łodzi", "cena przykładowa" → the active ticket with a countdown and watermark                                                                                   | "Inne miasto? Ta sama aplikacja."                             |
| 48–68 | **Języki** (wieczorem) | All real, recorded: tap "PL" → Українська, the whole screen changes; open Podróż in Ukrainian; airplane mode, then switch to Deutsch, and it still works. A quick 8-language cycle of the line "Od czego zaczynamy?" (~1.2 s each, no flashing)                                                   | "Cała aplikacja w Twoim języku. Także offline."               |
| 68–85 | Outro                  | "Sprawdź sam: link, bez logowania", the URL, "Dane są fikcyjne", the disclaimer                                                                                                                                                                                                                   | "Mniej kroków. Ty decydujesz."                                |

Optional add-on, a strong accessibility proof: about 10 s of **senior mode** turned on inside the ZUS chapter.
A VoiceOver clip would need a recording on a real device, so it is phase 2.

Fictional data, all labelled "przykład":

- Contributions: 14 years 3 months, "za wrzesień: wpłacona", no pension formula.
- Child-care L4 for Zosia (6): no diagnosis, no ICD code.
- Visit: ul. Przykładowa 1, Kraków, window 7.
- Ticket: 9,99 zł "cena demo", "ważny jeszcze 58 min".
- Dates are relative to the render day.

## 4. Voice and text

- **v1: no voice-over.** The video is silent (no music, or one quiet CC0 track with its licence in the repo).
  The story is told through captions and title cards. That avoids autoplay-with-sound problems, and under WCAG
  it counts as video-only: a text alternative is enough.
- **Captions** (from the plain-language editor):
  - Up to 32–35 characters per line, 2 lines at most.
  - Hold for 3 s + 0.4 s per word, so seniors can read them twice.
  - Digits ("969 miast"). ZUS is fine, L4 only next to "zwolnienie lekarskie", never e-ZLA or PUE.
  - Feminine verb forms (Katarzyna).
  - Size duration for the longest locale (de and lt are about 30% longer).
- **Assistant** is shown only as chat bubbles. A short exchange (topic chips → slot → confirmation) shows "the
  assistant asks, you decide". It is not the narrator.
- **Phase 2 voice-over:** Polish only, rendered at build time with **Piper** (`pl_PL-gosia`, CC0 data and an
  MIT model), with each clip's length setting the scene durations. A human voice comes last, once the script
  is frozen. In another locale the voice-over is muted and captions stay.
- **Transcript** under the player ("Pokaż opis filmu", `<details>`) in all 8 languages. It describes every
  visual step and carries the same keys as the captions.

## 5. Technology (recommendation: one source, MP4 first)

The team split on this question. MP4 won as the first step: PWA engineer, accessibility, code reviewer and
architect. The live Player won as the better end state: language, UI and domain engineers. So we do both, in
this order:

1. **`apps/video` (`@mobywatel/video`)**, a new workspace with Remotion **4.0.539**, all `remotion` and
   `@remotion/*` packages pinned to the same exact version.
   - Compositions: `src/demo.tsx`, built from `<Series>` scenes `mobilny-zus`, `bilety` and `jezyki`.
   - Scenes import `@mobywatel/brand` (TS token values, light theme), `@mobywatel/ui` and
     `@mobywatel/content`. They render presentational screens fed with fixtures, never the router, IndexedDB
     or the service worker.
   - Language comes from a `locale` prop and the `messages/<locale>/demo.json` catalogues.
   - Inter Tight is bundled, so renders come out the same every time.
   - `remotion.config.ts` overrides webpack for CSS modules. Not verified yet: spike this first.
   - Scripts `studio` (`pnpm run dev:video`, its own portless name) and `render`. Not `build`, so CI and
     Vercel never render. The output goes to `apps/pwa/public/video/`.
2. **The page plays a rendered MP4.**
   - Markup: `<video controls preload="none" playsinline poster>` with a fixed aspect ratio.
   - `demo-v1.mp4`: Polish visuals, 1080p H.264, ≤ 8 MB.
   - **8 WebVTT tracks**, one per locale, plus the transcript.
   - Same origin, so no CSP change. Header `Cache-Control: immutable`, with the version in the file name.
   - **Never precached.** A runtime CacheFirst with `RangeRequestsPlugin` (already in the store). Offline: the
     poster plus "Film obejrzysz po połączeniu z internetem".
3. **Later, optional: `@remotion/player`** on the desktop landing page only, `lazy()` and mounted near the
   viewport.
   - Benefits: captions and screens in the active language, and dates that never go stale.
   - Precache: kept out with `globIgnores`, like Inter Tight.
   - Measure the bundle and CPU on a weak laptop first, and cut it if it fails the budget.

The same source also gives a **9:16 social cut** (a `layout` prop) and the MP4 for the submission form. The
submission form takes one extra link; post it unlisted on YouTube or Vimeo. A **3–4 minute Sejm version** with
narration is a separate cut, built later from the same scenes.

## 6. The "Demo" section on the page

- `DEMO_ID = 'demo'` in `showcase-mode.ts`, plus `nav.demo` between Prototyp and Dla kogo.
  - Also add it to the IntersectionObserver list, the hash allowlist and the `/prototype` header.
  - Header order: Start · Prototyp · **Demo** · Dla kogo · Nowości · Technologia. That is 6 links, so check
    that they fit at 1100 px.
- Layout: one window tall (`min-height: calc(100dvh - var(--header-height))`), the same heading style as the
  other sections.
  - On the left: h2 "Demo", a lead, and the three **chapter buttons**. These are a labelled group with
    `aria-pressed`, not tabs. Each seeks to its chapter, and the active one follows playback.
  - Below the buttons: the active chapter's sentence and **"Wypróbuj w prototypie"**. That is a real
    `<a target="phone">` plus `navigatePhone` + `goToPhone`, the same pattern as "Dla kogo?".
  - The targets: ZUS → the ZUS category, Bilety → `matterPath('travel','cityTicket')`, Języki → Start.
  - On the right, the video at 16:9.
  - In a narrow window it all stacks and the buttons wrap.
- **Never autoplay.** With JS: no autoplay ever, so the snap and `prefers-reduced-motion` stay calm. A 56 px
  play button on the poster.
- Native controls: keyboard, fullscreen and PiP come for free. Check that the GSAP snap doesn't fight
  fullscreen and seeking.

## 7. Accessibility must-haves

- No autoplay. Pause is always available. Nothing flashes more than 3 times a second, including the language
  cycle.
- Captions and burned-in text: ≥ 4.5:1 on a solid plate, ≥ 48 px at 1080p, held ≥ 3 s.
- Controls and chapter buttons: names in 8 languages, ≥ 48 px (56 px in senior mode), visible focus.
- The transcript describes every visual step. Each `<track>` has `srclang` and a label.
- axe passes on the section, in both paused and playing states, and the section is keyboard-only operable.

## 8. Tests and guardrails

- New file `e2e/showcase-demo.spec.ts`, desktop Chrome and Safari:
  - nav order and `#demo`;
  - no video request before play;
  - `paused` after scrolling in;
  - the chapter buttons seek to within ±0.5 s;
  - "Wypróbuj" opens the right phone screen;
  - captions follow the locale (pl and uk);
  - reduced motion;
  - axe.
- `i18n.test.ts` and the translation lock pick up `demo.json` automatically.
- `audit:guardrails`:
  - every composition renders the shared `<DisclaimerFrame>`;
  - every `<video>` in `apps/pwa/src` has a `<track kind="captions">` and a poster;
  - nothing under `video/**` ends up in the precache.
- `remotion still` of 1–2 key frames per chapter for visual comparison.
- A **manual frame-by-frame check** for marks before submission (`competition-submission` checklist), because
  no script can see inside an MP4.
- **Re-render in the last week** before 30.11, so the video matches the final app.

## 9. Who does what

| Step                                                                        | Owner                                    |
| --------------------------------------------------------------------------- | ---------------------------------------- |
| Storyboard, final claims                                                    | product-manager                          |
| Polish captions, ConfirmCard texts                                          | service-designer + conversation-designer |
| Review of the wording                                                       | plain-language-editor                    |
| 7 other caption languages, glossary                                         | language-engineer                        |
| Hue per chapter, badges, intro and outro, `brand-video` decision record     | brand-designer                           |
| Fixtures (ZUS, ticket) in `@mobywatel/content`                              | domain-engineer                          |
| `apps/video` workspace, `video` commitlint scope, `demo-video` skill, audit | harness-engineer                         |
| Scenes and the Demo section                                                 | ui-engineer                              |
| Video caching, headers, render output                                       | pwa-engineer                             |
| E2E                                                                         | qa-engineer                              |
| Audit                                                                       | accessibility-auditor, code-reviewer     |

Rough effort:

- Spike: Remotion with our TS packages and CSS modules, ½ day.
- Scenes: 3 days.
- Section and tests: 1 day.
- Captions and translations: 1 day.
- Re-render before 30.11.

The fallback if Remotion fails the spike: a Playwright screen recording in a CSS phone frame, with the same
captions, VTT and section. About 1 day.

## 10. Decisions for the user

1. **Remotion licence.** It is free for an individual or a company of up to 3 employees. If an employer with
   more staff submits the entry, it needs a Company License. Who submits?
2. **Proposal screens in the video:** allowed with the "Propozycja" badge (recommended), or only screens that
   are built? Built-only means the ZUS chapter shrinks to the category and "Wkrótce".
3. **Voice-over:** none in v1 (recommended), Piper TTS, or a human voice.
4. **Phones:** the landing page shows only on desktops, so phone jurors never see the Demo section. Should we
   add an entry inside the app (e.g. a "Zobacz film" tile)?
5. **Where the MP4 lives:** in our deploy (`public/video/`, recommended) and/or unlisted on YouTube for the
   form.
6. **The name "Mobilny ZUS":** fine as plain text with no marks? Or a neutral title such as "ZUS w aplikacji"?
