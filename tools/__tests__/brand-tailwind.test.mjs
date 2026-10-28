// The Tailwind theme (packages/brand/src/tailwind.css) must stay a mirror of the tokens (tokens.ts):
// radii are written out there (a var() of the same name would point at itself), and colours only point at
// token variables (docs/decisions/tailwind-2026-10-28.md).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const brand = join(dirname(fileURLToPath(import.meta.url)), '../../packages/brand/src');
const css = readFileSync(join(brand, 'tailwind.css'), 'utf8');
const tokens = readFileSync(join(brand, 'tokens.ts'), 'utf8');

test('tailwind.css has the same radii as tokens.ts', () => {
  const block = tokens.match(/export const RADIUS = \{([^}]*)\}/)?.[1] ?? '';
  const radii = [...block.matchAll(/(\w+): (\d+)/g)].map(([, name, px]) => [name, px]);
  assert.ok(radii.length >= 4, 'RADIUS not found in tokens.ts');
  for (const [name, px] of radii) {
    assert.ok(css.includes(`--radius-${name}: ${px}px;`), `--radius-${name} should be ${px}px`);
  }
});

test('tailwind.css has no literal colours: every colour points at a token variable', () => {
  const lines = css.split('\n').filter((l) => l.trim().startsWith('--color-'));
  assert.ok(lines.length > 10);
  for (const line of lines) {
    assert.match(line, /--color-[a-z*-]+: (var\(--[a-z-]+\)|initial|transparent|currentColor);/);
  }
});
