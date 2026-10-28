#!/usr/bin/env node
// Production deploy of `main` to Vercel (project `sprawnie`, https://sprawnie-prototype.vercel.app).
// Only from a clean `main` that matches GitHub, so production is always a commit everyone can see.
// The Vercel build runs `pnpm turbo run build` (apps/pwa/vercel.json); the pre-bash hook asks before it.
// Usage: pnpm run deploy:prod
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

function stop(message) {
  console.error(`deploy:prod: ${message}`);
  process.exit(1);
}

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch !== 'main') {
  stop(`on "${branch}". Production is deployed from main only (git switch main).`);
}
if (git('status', '--porcelain', '--untracked-files=no')) {
  stop('uncommitted changes. Commit them first: production must be a commit on GitHub.');
}
git('fetch', '--quiet', 'origin', 'main');
const head = git('rev-parse', 'HEAD');
if (head !== git('rev-parse', 'origin/main')) {
  stop('main differs from origin/main. Pull or push first.');
}

console.log(`deploy:prod: deploying ${head.slice(0, 7)} (${git('log', '-1', '--format=%s')})`);
execFileSync('pnpm', ['dlx', 'vercel@latest', 'deploy', '--prod', '--yes'], { stdio: 'inherit' });
