// "/" is the landing page everywhere (user, 2026-10-28): on a desktop with the app in a phone mockup, on a
// phone or tablet as one column with a button into the app. /prototype/* is the app itself, except on a
// desktop, where it is the app inside the mockup (an iframe of the same URL). The installed app and the framed
// copy always get the app.
import { useSyncExternalStore } from 'react';

import { isPrototypePath, PATHS } from '../../app/paths.ts';

/** A desktop: a big window and a mouse or trackpad. Tablets (touch first) get the app full screen. */
export const SHOWCASE_QUERY =
  '(min-width: 64rem) and (min-height: 40rem) and (hover: hover) and (pointer: fine)';
const STANDALONE_QUERY = '(display-mode: standalone)';
const ROUTE_MESSAGE = 'sprawnie:route';
const NAVIGATE_MESSAGE = 'sprawnie:navigate';

/** The phone's iframe name: a link with this target opens its page inside the phone. */
export const PHONE_FRAME = 'phone';

/** Id of the landing page's first section (the hero): the header's "Start" link goes there. */
export const HERO_ID = 'section-hero';

/** Id of the section with the working phone: the hero's button scrolls there. */
export const TRY_ID = 'wyprobuj';

/** Id of the landing page's "Demo" section (the video, right after the phone). */
export const DEMO_ID = 'demo';

/** Id of the landing page's "Dla kogo" section (example people it helps). */
export const AUDIENCE_ID = 'dla-kogo';

/** Id of the landing page's section on what is new. */
export const NEWS_ID = 'nowosci';

/** Id of the landing page's last section (how the prototype is built). */
export const TECH_ID = 'technologia';

export function isEmbedded(): boolean {
  return typeof window !== 'undefined' && window.self !== window.top;
}

function wideScreen(): boolean {
  return window.matchMedia(SHOWCASE_QUERY).matches && !window.matchMedia(STANDALONE_QUERY).matches;
}

function standalone(): boolean {
  return window.matchMedia(STANDALONE_QUERY).matches;
}

/** This document shows a desktop page (landing or phone mockup), not the bare app. */
export function isDesktopPage(): boolean {
  return wideScreen() && !isEmbedded();
}

/** "/" shows the landing page: everywhere except in the installed app and inside the phone mockup. */
export function showsLanding(): boolean {
  return !standalone() && !isEmbedded();
}

/** A phone or tablet window: the landing page is one column and has no phone mockup. */
export function useNarrowLanding(): boolean {
  return !useSyncExternalStore(subscribe, wideScreen, () => true);
}

/** Re-render on a window resize across the breakpoint, on install (standalone), and on Back/Forward (the
 *  page kind also depends on the path: Back to "/" must show the landing page again). */
function subscribe(listener: () => void): () => void {
  const queries = [window.matchMedia(SHOWCASE_QUERY), window.matchMedia(STANDALONE_QUERY)];
  for (const mql of queries) {
    mql.addEventListener('change', listener);
  }
  window.addEventListener('popstate', listener);
  return () => {
    for (const mql of queries) {
      mql.removeEventListener('change', listener);
    }
    window.removeEventListener('popstate', listener);
  };
}

export type PageKind = 'landing' | 'mockup' | 'app';

/** What this document renders; follows the window across the desktop breakpoint. */
export function usePageKind(): PageKind {
  const wide = useSyncExternalStore(subscribe, wideScreen, () => false);
  const pathname = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => PATHS.landing
  );
  const installed = useSyncExternalStore(subscribe, standalone, () => false);
  if (installed || isEmbedded()) {
    return 'app';
  }
  if (pathname === PATHS.landing) {
    return 'landing';
  }
  return wide && isPrototypePath(pathname) ? 'mockup' : 'app';
}

type Place = { location: { pathname: string; search: string; hash: string } };

/**
 * In the framed app: tell the showcase page where the app is, so its address bar follows (also on the
 * first load), and go where the page asks (its hero links).
 */
export function reportRouteToShowcase(router: {
  state: Place;
  subscribe: (fn: (state: Place) => void) => unknown;
  navigate: (to: string) => unknown;
}): void {
  const report = ({ location: { pathname, search, hash } }: Place) =>
    window.parent.postMessage(
      { type: ROUTE_MESSAGE, path: pathname + search + hash },
      window.location.origin
    );
  report(router.state);
  router.subscribe(report);
  window.addEventListener('message', (event: MessageEvent) => {
    const data = event.data as { type?: unknown; path?: unknown } | null;
    if (
      event.origin === window.location.origin &&
      event.source === window.parent &&
      data?.type === NAVIGATE_MESSAGE &&
      typeof data.path === 'string' &&
      data.path.startsWith('/') &&
      !data.path.startsWith('//')
    ) {
      void router.navigate(data.path);
    }
  });
}

/** In the showcase page: open a screen inside the phone. False when the phone isn't there to ask. */
export function navigatePhone(frame: HTMLIFrameElement | null, path: string): boolean {
  const app = frame?.contentWindow;
  if (!app) {
    return false;
  }
  app.postMessage({ type: NAVIGATE_MESSAGE, path }, window.location.origin);
  return true;
}

/** In the showcase page: mirror the framed app's route into the address bar. */
export function onShowcaseRoute(frame: () => HTMLIFrameElement | null, handle: (path: string) => void) {
  const listener = (event: MessageEvent) => {
    const data = event.data as { type?: unknown; path?: unknown } | null;
    if (
      event.origin === window.location.origin &&
      event.source === frame()?.contentWindow &&
      data?.type === ROUTE_MESSAGE &&
      typeof data.path === 'string' &&
      data.path.startsWith('/') &&
      !data.path.startsWith('//')
    ) {
      handle(data.path);
    }
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
