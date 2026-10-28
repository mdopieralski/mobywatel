// Runs first (main.tsx imports it before the router reads the address), so the app starts on the right
// URL: links from before /prototype existed (/kategorie/zus) move under it, and "/" in the installed app goes
// straight to the app. Everywhere else "/" stays the landing page (phones too).
import { showsLanding } from '../features/showcase/showcase-mode.ts';
import { isPrototypePath, PATHS, PROTOTYPE } from './paths.ts';

const { search, hash } = window.location;
// The router matches paths without case and ignores a trailing slash; compare the same way here.
// "/index.html" is the landing page under another name.
const raw = window.location.pathname.toLowerCase().replace(/\/+$/, '') || PATHS.landing;
const pathname = raw === '/index.html' ? PATHS.landing : raw;

/** Where this load should be: the clean path, moved under /prototype or to the landing page if needed. */
function target(): string {
  if (pathname === PATHS.landing) {
    return showsLanding() ? PATHS.landing : PROTOTYPE;
  }
  if (pathname === PATHS.brandVoice || isPrototypePath(pathname)) {
    return pathname;
  }
  return `${PROTOTYPE}${pathname}`;
}

const to = target();
if (to !== window.location.pathname) {
  window.history.replaceState(null, '', `${to}${search}${hash}`);
}
