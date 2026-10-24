#!/usr/bin/env node
// SessionStart: where we stand (branch, dirty tree, days to the competition deadline). stdout = context.
import { readFileSync } from 'node:fs';

import { gitContext } from '../../tools/harness/git-context.mjs';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  // no payload: still print what we know
}
const root = process.env.CLAUDE_PROJECT_DIR ?? payload.cwd ?? process.cwd();
const { branch, dirty } = gitContext(root);

const DEADLINE = Date.UTC(2026, 10, 30, 23, 0); // 30.11.2026 end of day, Polish time (CET = UTC+1)
const days = Math.ceil((DEADLINE - Date.now()) / 86_400_000);

const lines = [];
lines.push(
  days > 0
    ? `mObywatel challenge prototype: ${days} day(s) to the submission deadline (30.11.2026).`
    : 'mObywatel challenge prototype: the submission deadline (30.11.2026) has passed.'
);
if (branch) {
  lines.push(
    `On \`${branch}\`.${branch === 'main' ? ' Cut a feat/<area> branch before changing code.' : ''}`
  );
}
if (dirty) {
  lines.push(`${dirty} uncommitted path(s): may be the user's work in progress.`);
}
lines.push(
  'Hard rules: no state emblem / mObywatel marks / official document artwork, fictional data only, visible "unofficial prototype" disclaimer, plain Polish, accessible (prototype-guardrails, accessibility skills).'
);
lines.push('Build with the add-feature skill, prove with verify-change, ship with ship-branch.');
process.stdout.write(`${lines.join('\n')}\n`);
