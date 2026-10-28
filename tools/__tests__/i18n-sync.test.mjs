import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { check, flatten, hash, readBrand, stamp } from '../i18n/sync.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '../..');

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'moby-i18n-'));
  for (const [p, c] of Object.entries(files)) {
    mkdirSync(dirname(join(root, p)), { recursive: true });
    writeFileSync(join(root, p), typeof c === 'string' ? c : JSON.stringify(c));
  }
  return root;
}

const msg = (locale, ns, body) => [`apps/pwa/messages/${locale}/${ns}.json`, body];

test('flatten prefixes keys with the namespace', () => {
  assert.deepEqual(flatten({ a: { b: 'x' }, c: 'y' }, 'ns'), { 'ns.a.b': 'x', 'ns.c': 'y' });
});

test('a new translation is stale until stamped, then current', () => {
  const root = fixture(
    Object.fromEntries([msg('pl', 'home', { hi: 'Cześć' }), msg('en', 'home', { hi: 'Hi' })])
  );
  assert.deepEqual(check(root, ['en']).en, { missing: [], stale: ['home.hi'], orphaned: [] });
  stamp(root, ['en']);
  assert.deepEqual(check(root, ['en']).en, { missing: [], stale: [], orphaned: [] });
});

test('changing the Polish makes the stamped translation stale', () => {
  const root = fixture(
    Object.fromEntries([msg('pl', 'home', { hi: 'Cześć' }), msg('en', 'home', { hi: 'Hi' })])
  );
  stamp(root, ['en']);
  writeFileSync(join(root, 'apps/pwa/messages/pl/home.json'), JSON.stringify({ hi: 'Dzień dobry' }));
  assert.deepEqual(check(root, ['en']).en.stale, ['home.hi']);
});

test('missing, empty and orphaned keys are reported', () => {
  const root = fixture(
    Object.fromEntries([msg('pl', 'home', { a: 'A', b: 'B' }), msg('en', 'home', { a: '  ', old: 'Old' })])
  );
  const { missing, orphaned } = check(root, ['en']).en;
  assert.deepEqual(missing, ['home.a', 'home.b']);
  assert.deepEqual(orphaned, ['home.old']);
});

test('stamp refuses an untranslated key and an unknown key', () => {
  const root = fixture(Object.fromEntries([msg('pl', 'home', { a: 'A' }), msg('en', 'home', {})]));
  assert.throws(() => stamp(root, ['en'], ['home.a']), /not translated/);
  assert.throws(() => stamp(root, ['en'], ['home.zzz']), /not a Polish key/);
});

test('brand strings are read from copy.ts', () => {
  const pl = readBrand(repo, 'pl');
  const uk = readBrand(repo, 'uk');
  assert.ok(pl['brand.tagline']);
  assert.ok(pl['brand.disclaimer'].includes('mobywatel.ai'));
  assert.ok(uk['brand.tagline']);
  assert.ok(uk['brand.disclaimer'].includes('mObywatel'));
});

test('this repo’s translations match the Polish source', () => {
  for (const [locale, report] of Object.entries(check(repo))) {
    assert.deepEqual(report, { missing: [], stale: [], orphaned: [] }, `${locale} is out of date`);
  }
});

test('hash is short and stable', () => {
  assert.equal(hash('Cześć'), hash('Cześć'));
  assert.equal(hash('x').length, 8);
});
