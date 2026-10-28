// Renders the demo video (docs/product/demo-video.md). Local only: it needs a headless Chrome and takes a
// few minutes, so CI and Vercel never run it. Commit the files it writes to apps/pwa/public/video/.
//
//   pnpm run render:demo            the page video + poster (apps/pwa/public/video)
//   pnpm run render:demo -- --napisy  also the copy with Polish captions burned in (out/, for the form)
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Bump when the video changes: the file name is the cache key (served as immutable).
const VERSION = 'v1';
const POSTER_FRAME = 75;
const MAX_MB = 8;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, '../pwa/public/video');
const outDir = join(root, 'out');
mkdirSync(publicDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

function remotion(...args) {
  execFileSync(join(root, 'node_modules/.bin/remotion'), args, { cwd: root, stdio: 'inherit' });
}

const video = join(publicDir, `demo-${VERSION}.mp4`);
remotion('render', 'src/index.ts', 'demo', video, '--codec=h264', '--crf=28', '--bundle-cache=false');
remotion(
  'still',
  'src/index.ts',
  'demo',
  join(publicDir, `demo-${VERSION}-poster.jpg`),
  `--frame=${POSTER_FRAME}`,
  '--image-format=jpeg',
  '--jpeg-quality=80',
  '--scale=0.5'
);

if (process.argv.includes('--napisy')) {
  remotion(
    'render',
    'src/index.ts',
    'demo-napisy',
    join(outDir, `demo-${VERSION}-napisy.mp4`),
    '--codec=h264',
    '--crf=23'
  );
}

const mb = statSync(video).size / 1024 / 1024;
console.log(`demo-${VERSION}.mp4: ${mb.toFixed(1)} MB`);
if (mb > MAX_MB) {
  console.error(`Over the ${MAX_MB} MB budget: raise --crf or shorten the video.`);
  process.exit(1);
}
