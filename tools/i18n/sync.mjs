#!/usr/bin/env node
// Translation lock: catches translations left behind when the Polish source changes.
//
// apps/pwa/messages/translations.lock.json stores, for each locale and key, a short hash of the Polish text
// the translation was made from. `check` compares it with the Polish of today:
//   missing  – Polish has the key, the locale doesn't (or it is empty);
//   stale    – the Polish changed since the translation was stamped;
//   orphaned – the locale (or the lock) still has a key Polish no longer has.
// `stamp <locale|all> [keys…]` records the current Polish hash once a key is translated.
//
// Usage: node tools/i18n/sync.mjs check | stamp <locale|all> [key…]   (pnpm run i18n:check / i18n:stamp)
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SOURCE_LOCALE = 'pl';
export const TARGET_LOCALES = ['en', 'uk', 'de', 'cs', 'sk', 'lt', 'be'];
const LOCK_FILE = 'apps/pwa/messages/translations.lock.json';
const MESSAGES_DIR = 'apps/pwa/messages';
const COPY_FILE = 'packages/brand/src/copy.ts';

/** First 8 hex chars of SHA-256: enough to notice a change, short enough to read in a diff. */
export function hash(text) {
  return createHash('sha256').update(text).digest('hex').slice(0, 8);
}

/** { a: { b: 'x' } } → { 'a.b': 'x' }, with the namespace (file name) as the first segment. */
export function flatten(value, prefix, out = {}) {
  if (typeof value === 'string') {
    out[prefix] = value;
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

/** All message keys of one locale, plus the brand strings for every locale (TAGLINES, UNOFFICIAL_DISCLAIMERS). */
export function readLocale(root, locale) {
  const dir = join(root, MESSAGES_DIR, locale);
  const out = {};
  if (existsSync(dir)) {
    for (const file of readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .sort()) {
      flatten(readJson(join(dir, file)), file.replace(/\.json$/, ''), out);
    }
  }
  Object.assign(out, readBrand(root, locale));
  return out;
}

/** The two translated brand strings, read as text so this tool needs no TypeScript loader. */
export function readBrand(root, locale) {
  const path = join(root, COPY_FILE);
  if (!existsSync(path)) {
    return {};
  }
  const src = readFileSync(path, 'utf8');
  const out = {};
  if (locale === SOURCE_LOCALE) {
    const tagline = src.match(/export const TAGLINE =\s*'([^']*)'/);
    const disclaimer = src.match(/export const UNOFFICIAL_DISCLAIMER =\s*'([^']*)'/);
    if (tagline) out['brand.tagline'] = tagline[1];
    if (disclaimer) out['brand.disclaimer'] = disclaimer[1];
    return out;
  }
  const entry = (name) => {
    const block = src.match(new RegExp(`export const ${name}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};`));
    return block?.[1].match(new RegExp(`\\n\\s*${locale}:\\s*'([^']*)'`))?.[1];
  };
  const tagline = entry('TAGLINES');
  const disclaimer = entry('UNOFFICIAL_DISCLAIMERS');
  if (tagline) out['brand.tagline'] = tagline;
  if (disclaimer) out['brand.disclaimer'] = disclaimer;
  return out;
}

export function readLock(root) {
  const path = join(root, LOCK_FILE);
  return existsSync(path) ? readJson(path) : {};
}

function writeLock(root, lock) {
  const sorted = Object.fromEntries(
    Object.keys(lock)
      .sort()
      .map((locale) => [
        locale,
        Object.fromEntries(
          Object.keys(lock[locale])
            .sort()
            .map((k) => [k, lock[locale][k]])
        ),
      ])
  );
  writeFileSync(join(root, LOCK_FILE), `${JSON.stringify(sorted, null, 2)}\n`);
}

/** Per locale: { missing, stale, orphaned } key lists. Empty lists everywhere means all is current. */
export function check(root, locales = TARGET_LOCALES) {
  const source = readLocale(root, SOURCE_LOCALE);
  const lock = readLock(root);
  const report = {};
  for (const locale of locales) {
    const target = readLocale(root, locale);
    const stamps = lock[locale] ?? {};
    const missing = [];
    const stale = [];
    for (const [key, text] of Object.entries(source)) {
      if (!target[key]?.trim()) {
        missing.push(key);
      } else if (stamps[key] !== hash(text)) {
        stale.push(key);
      }
    }
    const orphaned = [...new Set([...Object.keys(target), ...Object.keys(stamps)])]
      .filter((key) => !(key in source))
      .sort();
    report[locale] = { missing, stale, orphaned };
  }
  return report;
}

/** Record the current Polish hash for the given keys (all keys when none given). Returns the keys stamped. */
export function stamp(root, locales, keys = []) {
  const source = readLocale(root, SOURCE_LOCALE);
  const lock = readLock(root);
  const stamped = [];
  for (const locale of locales) {
    const target = readLocale(root, locale);
    lock[locale] ??= {};
    // Drop stamps of keys Polish no longer has.
    for (const key of Object.keys(lock[locale])) {
      if (!(key in source)) delete lock[locale][key];
    }
    for (const key of keys.length ? keys : Object.keys(source)) {
      if (!(key in source)) {
        throw new Error(`${key}: not a Polish key`);
      }
      if (!target[key]?.trim()) {
        throw new Error(`${locale} ${key}: not translated yet, nothing to stamp`);
      }
      lock[locale][key] = hash(source[key]);
      stamped.push(`${locale} ${key}`);
    }
  }
  writeLock(root, lock);
  return stamped;
}

function main(argv) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
  const [command, which, ...keys] = argv;
  if (command === 'check') {
    const report = check(root);
    let problems = 0;
    for (const [locale, { missing, stale, orphaned }] of Object.entries(report)) {
      for (const [label, list] of [
        ['missing', missing],
        ['stale', stale],
        ['orphaned', orphaned],
      ]) {
        for (const key of list) {
          console.log(`${locale}  ${label.padEnd(8)}  ${key}`);
          problems += 1;
        }
      }
    }
    if (problems) {
      console.log(
        `\n${problems} translation(s) to update. Translate them (language-engineer agent), then` +
          ' `pnpm run i18n:stamp <locale> <keys…>`.'
      );
      return 1;
    }
    console.log(`Translations current: ${TARGET_LOCALES.join(', ')} match the Polish source.`);
    return 0;
  }
  if (command === 'stamp') {
    if (which !== 'all' && !TARGET_LOCALES.includes(which)) {
      console.error(`Usage: stamp <${TARGET_LOCALES.join('|')}|all> [key…]`);
      return 2;
    }
    const stamped = stamp(root, which === 'all' ? TARGET_LOCALES : [which], keys);
    console.log(`Stamped ${stamped.length} translation(s).`);
    return 0;
  }
  console.error('Usage: node tools/i18n/sync.mjs check | stamp <locale|all> [key…]');
  return 2;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
