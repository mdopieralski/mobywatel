# mObywatel prototype (mobywatel.ai challenge)

A clickable **PWA prototype of a new mObywatel app**, our entry to the mObywatel Challenge
(https://mobywatel.ai, organised by Klub Parlamentarny Rozwój Plus). The bar to beat is the reference
prototype, an AI assistant that handles official matters through conversation. Our entry has to be **simpler,
more convenient, more accessible, or handle more matters**. The top 10 entries are presented in the Sejm.
Submissions close **30.11.2026** (end of day, Polish time). The submission is an `https://` link that works
**without login** and stays up until the results.

Competition facts, personas and what we know about judging: `docs/product/competition-brief.md` (the
`product-knowledge` skill). The product working name is TBD (`docs/product/`). It must not use the mObywatel
logo or marks.

## Hard rules (the guard hooks enforce the first three)

- **No official marks.** Never use the state emblem (godło), the mObywatel name styled as its logo, its icons,
  or official document artwork (mDowód / prawo jazdy / KDR cards, strips, holograms), and never the photos
  from the reference prototype. The reference code is MIT, but these are excluded from the licence. Design our
  own neutral artwork (`prototype-guardrails` skill).
- **Fictional data only.** Personas, PESELs, document numbers, plates, addresses and payments are invented,
  and obviously so. No real person's data, no live government registry or API. The app never asks the user to
  type real personal data. If it has a text input, it says so.
- **Visibly unofficial.** `UNOFFICIAL_DISCLAIMER` from `@mobywatel/brand` is shown on the start screen and on
  every document view (an element with `data-disclaimer`). Document views carry a "PROTOTYP – nie jest
  dokumentem" watermark and can never be passed off as a real ID. `pnpm run audit:guardrails` checks this.
- **Works without login, on a phone, offline after the first load.** The jury opens a link on whatever device
  they have, so there are no accounts, no paywall and no API key prompt.
- **Accessible by default.** WCAG 2.2 AA as the floor. Large-text / senior mode, screen readers, keyboard, 48
  px targets, `prefers-reduced-motion`. Accessibility is one of the judging angles, not polish
  (`accessibility` skill).
- **Plain Polish.** Polish is the source language; the UI also ships in 7 more languages, always complete
  (`docs/decisions/languages-2026-10-25.md`). Short sentences, no officialese, one action per screen, and the
  assistant asks for confirmation before anything is "sent" (`plain-polish` skill).
- **Assistant without a backend by default.** Scripted scenarios run fully in the browser (like the
  reference's web version). A live LLM (OpenAI-compatible, so Bielik or PLLuM can plug in) is an optional
  layer behind a server-side proxy. API keys never reach the client (`ai-assistant` skill).
- **Tokens, not literals.** Colours, spacing and type come from `@mobywatel/brand`. A new hex in `apps/` or
  `packages/ui` is blocked by the post-edit hook.
- pnpm only (`pnpm add`, `pnpm exec`, `pnpm dlx`). Never npm, npx or yarn. Never push to `main`. Never skip
  hooks.

## Stack (defaults: change here first if you change them)

Decision record: `docs/decisions/stack-2026-10-24.md`.

- **Repo**: pnpm workspaces + Turborepo (`apps/*`, `packages/*`), Node 22, pnpm 10 (pinned in
  `packageManager`).
- **App** `apps/pwa` (`@mobywatel/pwa`): Vite + React + TypeScript strict, Tailwind CSS 4 on our tokens
  (`docs/decisions/tailwind-2026-10-28.md`), `vite-plugin-pwa` (Workbox) for the manifest and service worker,
  client-side routing, mobile-first layout that also reads well on a desktop (phone frame).
- **Shared packages**: `@mobywatel/core` (pure TS: matters as state machines, reminders, assistant scenario
  engine, ports; no React), `@mobywatel/content` (fictional personas, scenario scripts, service knowledge in
  plain Polish), `@mobywatel/brand` (tokens, copy, disclaimer), `@mobywatel/ui` (accessible React components).
- **Tests**: Vitest + Testing Library (unit), Playwright + axe (E2E on phone viewports), and `node --test` for
  `tools/`.
- **Hosting**: Vercel (static build, plus an optional serverless function for the LLM proxy).
- **Library versions change. Don't trust your training data.** Read the installed version in `package.json` /
  `node_modules`, then that version's docs. TypeScript is pinned to 6.0.x repo-wide (TS 7 breaks
  `typescript-eslint`); lint is oxlint. Details: the stack decision record.
- **Packages are source-only TS** (no build step). `apps/pwa/vite.config.ts` imports brand by relative path on
  purpose (Node can't load `.ts` workspace packages from the config).

## Layout (scaffolded 2026-10-24; feature folders fill in as we build)

```
apps/pwa/                 @mobywatel/pwa: the PWA
  src/app/                shell, router, layout, error boundary
  src/pwa/                SW registration, update prompt, install prompt
  src/platform/           storage (IndexedDB), i18n runtime, settings (senior mode, text size)
  src/features/<area>/    home, documents, matters/<matter>, assistant, reminders, privacy, settings
  messages/<locale>/*.json  UI copy: pl (source) + en uk de cs sk lt be, all complete
  e2e/                    Playwright flows (phone viewports, axe)
  api/                    optional serverless LLM proxy (keys server-side only)
apps/design-system/       @mobywatel/design-system: Storybook for @mobywatel/ui (stories in src/)
apps/video/               @mobywatel/video: the Remotion demo video (docs/product/demo-video.md)
packages/core/            @mobywatel/core: domain, no React
packages/content/         @mobywatel/content: fictional personas + scenario scripts
packages/brand/           @mobywatel/brand: tokens, copy, UNOFFICIAL_DISCLAIMER
packages/ui/              @mobywatel/ui: accessible React components
docs/product/             competition brief, concept, pitch, submission text
docs/services/            one design per matter (journey, data reuse, confirmations)
docs/decisions/           decision records <topic>-YYYY-MM-DD.md
tools/                    harness + audits (node --test)
.claude/                  agents, skills, hooks
```

## Team: agents and who owns what

The ownership map with paths is in the `add-feature` skill (§2). In short:

| Agent                   | Owns                                                                              |
| ----------------------- | --------------------------------------------------------------------------------- |
| `product-manager`       | concept, competition strategy, pitch and submission text (`docs/product/`)        |
| `service-designer`      | matter journeys (`docs/services/`), Polish copy (`messages/`), voice and tone     |
| `language-engineer`     | Polish → en uk de cs sk lt be (`messages/<locale>/`), glossary, native review     |
| `conversation-designer` | assistant persona and dialogue, scenario text (`packages/content/src/scenarios/`) |
| `brand-designer`        | `packages/brand`, name, icons, visual identity without official marks             |
| `pwa-architect`         | plans only (read-only)                                                            |
| `pwa-engineer`          | `apps/pwa` shell, router, `src/pwa/`, `src/platform/`, Vite/PWA config, deploy    |
| `ui-engineer`           | `packages/ui`, feature screens in `apps/pwa/src/features/` (not assistant)        |
| `domain-engineer`       | `packages/core` (not assistant), `packages/content` data                          |
| `assistant-engineer`    | assistant engine, `features/assistant`, voice, `apps/pwa/api/` LLM proxy          |
| `accessibility-auditor` | audits and reports (read-only on code)                                            |
| `plain-language-editor` | plain-Polish review of all user-facing text (read-only)                           |
| `qa-engineer`           | `apps/pwa/e2e/`, `docs/quality/`, acceptance runs                                 |
| `code-reviewer`         | reviews diffs (read-only)                                                         |
| `harness-engineer`      | `.claude/`, `tools/`, CI, root configs                                            |

Workflow: `add-feature` (plan → build → verify → review), `verify-change` (which checks prove what),
`ship-branch` (commit, PR), `competition-submission` (deploy, final checklist).

## Commands

```bash
pnpm install
pnpm dev                     # https://mobywatel.local (PWA dev, no SW) + /design-system (Storybook)
pnpm run build && pnpm preview   # same URLs, the real PWA: service worker, offline, install
PORTLESS=0 pnpm dev          # without portless: plain Vite on localhost
pnpm run dev:design-system   # Storybook alone on http://127.0.0.1:6006
pnpm run dev:video           # Remotion Studio for the demo video
pnpm run render:demo         # render the demo video into apps/pwa/public/video (local only)
pnpm run typecheck           # tsc in every workspace (turbo)
pnpm test                    # unit tests (turbo) + tool tests
pnpm run test:e2e            # Playwright flows on phone viewports
pnpm run audit:harness       # .claude/ consistency
pnpm run audit:guardrails    # no official marks, disclaimer present
pnpm run ci:quality          # everything CI runs
```

## Git

Branches `feat/<area>`, `fix/<area>`, `docs/…`, `chore/…` from `main`, with a PR into `main`. The user merges.
Conventional Commits with scope = area (`pwa`, `ui`, `brand`, `core`, `assistant`, `services`, `a11y`, `i18n`,
`e2e`, `claude`, `tooling`, `docs`).
