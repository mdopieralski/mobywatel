import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  bashFindings,
  brandHexFindings,
  contentAfter,
  editAllowed,
  officialMarkFindings,
  protectedFileFindings,
  readOnlyBashFindings,
  remindersFor,
} from '../harness/hook-rules.mjs';

const rules = (fs) => fs.map((f) => f.rule);

test('official marks: emblem, mObywatel logos, document art and reference photos are blocked', () => {
  for (const p of [
    'apps/pwa/public/godlo.svg',
    'apps/pwa/src/assets/Godło-RP.png',
    'apps/pwa/public/coat-of-arms.svg',
    'apps/pwa/public/logo-mobywatel.svg',
    'apps/pwa/public/card-mdowod.png',
    'apps/pwa/public/foto-marta.jpg',
    'apps/pwa/public/orzel-bialy.webp',
  ]) {
    assert.deepEqual(rules(officialMarkFindings(p)), ['official-marks'], p);
  }
  assert.deepEqual(officialMarkFindings('apps/pwa/public/icons/app-192.png'), []);
  assert.deepEqual(officialMarkFindings('apps/pwa/src/godlo.ts'), [], 'only asset files by name');
});

test('official marks: referencing reference-prototype assets is blocked outside rule sources', () => {
  const ref = "import x from '../ref/mobywatel-ai/mockup/assets/strip-kdr.png'";
  assert.deepEqual(rules(officialMarkFindings('apps/pwa/src/x.ts', ref)), ['official-marks']);
  assert.deepEqual(officialMarkFindings('tools/__tests__/x.test.mjs', ref), [], 'tests name the rule');
  assert.deepEqual(officialMarkFindings('.claude/skills/x/SKILL.md', ref), [], 'docs name the rule');
});

test('protected files', () => {
  assert.deepEqual(rules(protectedFileFindings('pnpm-lock.yaml')), ['protected-file']);
  assert.deepEqual(rules(protectedFileFindings('apps/pwa/.env.local')), ['protected-file']);
  assert.deepEqual(rules(protectedFileFindings('apps/pwa/dist/index.html')), ['protected-file']);
  assert.deepEqual(protectedFileFindings('apps/pwa/.env.example'), []);
  assert.deepEqual(protectedFileFindings('apps/pwa/src/main.tsx'), []);
});

test('brand hex: only newly added literals in apps and packages/ui', () => {
  assert.deepEqual(rules(brandHexFindings('apps/pwa/src/a.tsx', '', 'color: "#1a2b3c"')), ['brand-hex']);
  assert.deepEqual(brandHexFindings('apps/pwa/src/a.tsx', '#1a2b3c', 'x #1A2B3C'), [], 'already there');
  assert.deepEqual(brandHexFindings('packages/brand/src/colors.ts', '', '#1a2b3c'), [], 'brand owns hex');
  assert.deepEqual(brandHexFindings('apps/pwa/src/a.test.tsx', '', '#1a2b3c'), [], 'tests exempt');
  assert.deepEqual(rules(brandHexFindings('apps/pwa/src/x.css', '', 'a{color:#fff}')), ['brand-hex']);
});

test('contentAfter applies Edit, MultiEdit and Write', () => {
  assert.equal(contentAfter('Write', { content: 'new' }, 'old'), 'new');
  assert.equal(contentAfter('Edit', { old_string: 'a', new_string: 'b' }, 'a a'), 'b a');
  assert.equal(contentAfter('Edit', { old_string: 'a', new_string: 'b', replace_all: true }, 'a a'), 'b b');
  const multi = {
    edits: [
      { old_string: 'x', new_string: 'y' },
      { old_string: 'y', new_string: 'z' },
    ],
  };
  assert.equal(contentAfter('MultiEdit', multi, 'x'), 'z');
  assert.equal(
    contentAfter('Edit', { old_string: 'a', new_string: '$&$&' }, 'a'),
    '$&$&',
    'no replacement patterns'
  );
});

// Commands are assembled from parts so the live pre-bash hook doesn't flag this file's own text.
const NPM = ['np', 'm'].join('');
const FORCE = ['--', 'force'].join('');
const NO_VERIFY = ['--', 'no-verify'].join('');

test('bash: pnpm only', () => {
  assert.deepEqual(rules(bashFindings(`${NPM} install react`)), ['pnpm-only']);
  assert.deepEqual(rules(bashFindings('cd apps/pwa && yarn add x')), ['pnpm-only']);
  assert.deepEqual(rules(bashFindings(`${NPM.replace('m', 'x')} vite`)), ['pnpm-only']);
  assert.deepEqual(bashFindings('pnpm add -D vite --filter @mobywatel/pwa'), []);
  assert.deepEqual(bashFindings('pnpm run build'), []);
});

test('bash: git safety', () => {
  assert.deepEqual(rules(bashFindings(`git commit ${NO_VERIFY} -m x`)), ['no-verify']);
  assert.deepEqual(rules(bashFindings(`git push ${FORCE} origin feat/x`)), ['force-push']);
  assert.deepEqual(rules(bashFindings('git push origin main')), ['push-main']);
  assert.deepEqual(rules(bashFindings('git push', { branch: 'main' })), ['push-main']);
  assert.deepEqual(bashFindings('git push -u origin HEAD', { branch: 'feat/home' }), []);
  assert.deepEqual(bashFindings('git log main..HEAD'), []);
  const merge = bashFindings('gh pr merge 3');
  assert.deepEqual([merge[0].rule, merge[0].decision], ['merge', 'ask']);
  assert.equal(bashFindings('vercel deploy --prod')[0].decision, 'ask');
});

test('read-only bash: reading is fine, writing is not', () => {
  for (const ok of [
    'git diff --stat',
    'grep -rn foo apps',
    'cat a | jq .',
    'pnpm run typecheck',
    'ls > /dev/null',
    'git log > /tmp/log.txt',
  ]) {
    assert.deepEqual(readOnlyBashFindings(ok), [], ok);
  }
  for (const bad of [
    'echo x > apps/a.ts',
    'rm -rf dist',
    'git commit -m x',
    'pnpm add react',
    'node -e "1"',
    "sed -i '' s/a/b/ f",
    'gh pr create',
  ]) {
    assert.ok(readOnlyBashFindings(bad).length > 0, bad);
  }
});

test('read-only bash with an allow-list: own paths and shipping are fine', () => {
  const scope = { writable: ['docs/product/'] };
  assert.deepEqual(readOnlyBashFindings('echo x > docs/product/a.md', scope), []);
  assert.deepEqual(
    readOnlyBashFindings('git add docs/product/a.md && git commit -m x && git push -u origin HEAD', scope),
    []
  );
  assert.deepEqual(readOnlyBashFindings('gh pr create --fill', scope), []);
  assert.ok(readOnlyBashFindings('echo x > apps/pwa/a.ts', scope).length > 0);
  assert.ok(readOnlyBashFindings('git reset --hard', scope).length > 0);
});

test('editAllowed matches folders and exact files', () => {
  assert.ok(editAllowed('docs/product/brief.md', ['docs/product/']));
  assert.ok(editAllowed('NOTEBOOK.md', ['NOTEBOOK.md']));
  assert.ok(!editAllowed('docs/productx/a.md', ['docs/product/']));
  assert.ok(!editAllowed('apps/NOTEBOOK.md', ['NOTEBOOK.md']));
});

test('reminders fire for the right paths', () => {
  const ids = (p) => remindersFor(p).map((r) => r.id);
  assert.deepEqual(ids('apps/pwa/vite.config.ts'), ['pwa-offline']);
  assert.deepEqual(ids('packages/content/src/personas/marta.ts'), ['fictional-data', 'plain-polish']);
  assert.deepEqual(ids('apps/pwa/messages/pl/home.json'), ['plain-polish']);
  assert.deepEqual(ids('apps/pwa/src/screens/home.tsx'), ['a11y']);
});
