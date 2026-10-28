#!/usr/bin/env node
// Competition guardrails over the whole repo (prototype-guardrails skill):
//   1. no state emblem / mObywatel marks / official document art / reference photos (by file name)
//   2. no reuse of the reference prototype's excluded assets (by path in source)
//   3. once the app exists, the "unofficial prototype, fictional data" disclaimer is in the source
//   4. the demo video (apps/video) shows the disclaimer and the "PROTOTYP" badge in every frame, and a
//      <video> on the site has a poster and captions (docs/product/demo-video.md)
// Usage: node tools/guardrails-audit.mjs [--root <dir>]   exit 1 on findings.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { officialMarkFindings } from './harness/hook-rules.mjs';

const SKIP = new Set([
  'node_modules',
  '.git',
  'dist',
  'dev-dist',
  '.turbo',
  'coverage',
  'playwright-report',
  'test-results',
  'worktrees',
]);
const TEXT = /\.(ts|tsx|js|mjs|jsx|css|html|json|md)$/;

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) {
      continue;
    }
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

export function auditGuardrails(root) {
  const findings = [];
  let disclaimerFound = false;
  const appSrc = join(root, 'apps/pwa/src');
  const videoSrc = join(root, 'apps/video/src');
  const video = { disclaimer: false, badge: false };
  for (const abs of walk(root)) {
    const rel = relative(root, abs).split('\\').join('/');
    const content = TEXT.test(rel) && statSync(abs).size < 2_000_000 ? readFileSync(abs, 'utf8') : '';
    for (const f of officialMarkFindings(rel, content)) {
      findings.push({ file: rel, message: f.message });
    }
    if (
      /^(apps\/pwa\/(src|index\.html)|packages\/(brand|content)\/src)/.test(rel) &&
      /UNOFFICIAL_DISCLAIMER|data-disclaimer/.test(content)
    ) {
      disclaimerFound = true;
    }
    if (rel.startsWith('apps/video/src/')) {
      video.disclaimer ||= /UNOFFICIAL_DISCLAIMER/.test(content);
      video.badge ||= /<PrototypeBadge\b/.test(content);
    }
    if (/^apps\/pwa\/src\/.*\.tsx$/.test(rel) && /<video\b/.test(content)) {
      if (!/<video\b[^>]*\bposter=/.test(content)) {
        findings.push({
          file: rel,
          message: 'A <video> needs a poster, so nothing moves before someone presses play.',
        });
      }
      if (!/addTextTrack|<track\b[^>]*kind="captions"/.test(content)) {
        findings.push({
          file: rel,
          message: 'A <video> needs captions (a captions <track> or addTextTrack).',
        });
      }
    }
  }
  if (existsSync(videoSrc) && !(video.disclaimer && video.badge)) {
    findings.push({
      file: 'apps/video/src',
      message:
        'The demo video must show UNOFFICIAL_DISCLAIMER (intro and outro) and render <PrototypeBadge> over every frame.',
    });
  }
  if (existsSync(appSrc) && !disclaimerFound) {
    findings.push({
      file: 'apps/pwa/src',
      message:
        'No disclaimer found. Export UNOFFICIAL_DISCLAIMER from @mobywatel/brand copy and render it (element with data-disclaimer) on the start screen and every document view.',
    });
  }
  return findings;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const k = process.argv.indexOf('--root');
  const root = resolve(k > 0 ? process.argv[k + 1] : process.cwd());
  const findings = auditGuardrails(root);
  for (const f of findings) {
    console.log(`${f.file}: ${f.message}`);
  }
  console.log(
    findings.length ? `\naudit:guardrails: ${findings.length} finding(s)` : 'audit:guardrails: clean'
  );
  process.exit(findings.length ? 1 : 0);
}
