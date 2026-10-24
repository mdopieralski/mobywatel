# Agents guide

Read `CLAUDE.md` first: it is the source of truth for this repo (rules, stack, layout, owners).

This is a Vite + React + TypeScript PWA in a pnpm + Turborepo monorepo, built as an unofficial prototype for
the mobywatel.ai challenge.

- Use pnpm only: `pnpm add <pkg> --filter <workspace>`, `pnpm exec <bin>`, `pnpm dlx <pkg>`.
- Never add the state emblem, mObywatel logos/marks, official document artwork or real personal data.
- Polish is the source language for UI copy; keep it plain.
- Before declaring work done: `pnpm run typecheck`, `pnpm test`, and for UI changes a look at the built app on
  a phone viewport (`pnpm run build && pnpm preview`).
- Library APIs change: read the installed version and its docs, not memory.
