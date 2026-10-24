import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { auditGuardrails } from '../guardrails-audit.mjs';
import { auditHarness } from '../harness-audit.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '../..');

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'moby-audit-'));
  for (const [p, c] of Object.entries(files)) {
    mkdirSync(dirname(join(root, p)), { recursive: true });
    writeFileSync(join(root, p), c);
  }
  return root;
}

test('this repo’s harness is clean', () => {
  assert.deepEqual(auditHarness(repo), []);
});

test('this repo passes the guardrails', () => {
  assert.deepEqual(auditGuardrails(repo), []);
});

test('harness audit catches a mismatched name and unknown skills', () => {
  const root = fixture({
    '.claude/agents/a.md':
      '---\nname: b\ndescription: An agent that does a fairly specific job in this repository.\nskills:\n  - nope\n---\nUse the `ghost` skill.\n',
  });
  const msgs = auditHarness(root).map((f) => f.message);
  assert.ok(msgs.some((m) => m.includes('does not match')));
  assert.ok(msgs.some((m) => m.includes('unknown skill "nope"')));
  assert.ok(msgs.some((m) => m.includes('unknown skill "ghost"')));
});

test('guardrails audit catches an emblem file and a missing disclaimer', () => {
  const root = fixture({ 'apps/pwa/public/godlo.svg': '<svg/>', 'apps/pwa/src/main.tsx': 'export {}' });
  const files = auditGuardrails(root).map((f) => f.file);
  assert.ok(files.includes('apps/pwa/public/godlo.svg'));
  assert.ok(files.includes('apps/pwa/src'));
});
