---
name: competition-submission
description: >-
  Getting the prototype to the jury: Vercel preview vs production deploys, a stable https link that works
  without login and stays up, phone and offline checks, the mobywatel.ai form fields, the 30–4000 character
  description template, demo video tips, and the final checklist and freeze before 30.11.2026. Use for
  "deploy", "submission", "zgłoszenie", "opis konkursowy", "is it ready to submit?".
---

# Competition submission

Owner of the text and the go/no-go checklist: the `product-manager` agent. Deploy config: the `pwa-engineer`
agent. **The user submits the form.** Agents never submit, e-mail or post anything.

Facts as of 2026-10-24 (re-check `docs/product/competition-brief.md` and the site before submitting): deadline
**30.11.2026, end of day, Polish time**. The page also showed "Nabór zakończony" next to the deadline, so the
user confirms with the organisers that entries are open.

## 1. Deploy (Vercel)

- Every PR gets a **preview** URL. Use it for review and for testing on phones.
- The submission link is a **production** deploy of `main` on a stable domain (a `*.vercel.app` name we
  choose, or our own domain). The `pre-bash` hook asks before any production deploy, because it changes what
  the jury sees.
- Vercel project settings: root `apps/pwa`, build `pnpm run build`, output `dist`, Node 22. Turn off
  **Deployment Protection** on production so the link works without login, and check it in a private window.
- LLM proxy env vars only if the live assistant is part of the demo. Without them the app must still be
  complete (scripted mode).
- The link must stay up **until the results are announced**: no free-tier limits that could pause it, no
  expiring preview links, and nobody deletes the project.

## 2. Jury-eye checks (on the production URL)

1. A private window on a phone (iOS Safari and Android Chrome): opens without login, start screen, disclaimer
   visible, persona choice obvious.
2. "Try it in 60 seconds": from a cold open, the main demo matter finishes in ≤ 3 taps after choosing a
   persona.
3. Desktop browser: the phone frame renders well (the jury may open it on a laptop).
4. Flaky network: throttle to Slow 4G and load. Then go offline after the first load and reload; the demo
   still works.
5. Install on both platforms (the `pwa-platform` skill), then reset the demo.
6. Lighthouse mobile: record the numbers for the description if they're good.
7. `pnpm run audit:guardrails`, then look at every document view for the watermark and disclaimer (the
   `prototype-guardrails` skill).
8. Deep links work: `/?osoba=<id>` and a direct link to the showcase matter.

## 3. Form fields

| Field                          | Notes                                                                       |
| ------------------------------ | --------------------------------------------------------------------------- |
| Name / team name               | the user decides                                                            |
| E-mail, city, category         | the user's                                                                  |
| Concept title                  | short, our own name, not "mObywatel 2.0" as a mark                          |
| Description                    | **30–4000 characters**; template below; count with `wc -m`                  |
| Prototype link                 | `https://`, production, no login                                            |
| Extra link (optional)          | demo video                                                                  |
| Polish technologies (optional) | e.g. Bielik / PLLuM via the provider port, only if actually used and tested |
| Website (optional)             | repo or team page if public                                                 |
| Consents                       | rules + contact; publication consent applies only if selected               |

## 4. Description template (Polish, plain, ≤ 4000 characters)

```
Problem — one or two sentences: what is hard today (concrete matter, concrete person).
Co działa lepiej niż w prototypie referencyjnym — 3–5 bullets, each measurable:
  "Meldunek: 3 kroki zamiast wizyty w urzędzie" (step counts from docs/services/),
  "Tryb seniora: większy tekst, mniej wyborów, czytanie na głos",
  "Działa offline i instaluje się jak aplikacja".
Komu pomaga — personas in one line each.
Jak sprawdzić w 60 sekund — link, choose persona X, tap A → B → C.
Technologia — PWA, works on any phone; assistant scripted by default, optional Polish model.
Zastrzeżenie — nieoficjalny prototyp, dane fikcyjne.
```

Every claim must be backed by a flow that works on the production link today. The `product-manager` agent
checks each line against the code (the `product-knowledge` skill).

## 5. Demo video (optional, recommended)

60–120 seconds, screen recording on a real phone, one persona, one or two matters, senior mode toggled once.
Burned-in Polish captions (people watch without sound). No real data on screen and no notifications from the
recording phone. Hosted somewhere that stays up (unlisted YouTube or Vimeo).

## 6. Final checklist and freeze

- [ ] `pnpm run ci:quality` and `pnpm run test:e2e` green on `main`
- [ ] Production deploy of that commit; URL checked in a private window on two phones
- [ ] Guardrails audit clean; disclaimer and watermark visible; no official marks anywhere
- [ ] Description ≤ 4000 characters, claims verified, link inside correct
- [ ] Video link works logged out
- [ ] Organisers confirmed entries are open

**Freeze:** no production deploys in the last 48 hours before the deadline except fixes for a broken jury
path, each confirmed by the user. After submission, production changes only with the user's say-so. The jury
may be looking at it at any moment.
