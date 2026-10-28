// Desktop pages: on a desktop "/" is the landing page and /prototype/* shows the app inside a phone mockup
// (an iframe of the same URL). Phones, tablets, installed apps and the framed copy itself get the app.
import { useSyncExternalStore } from 'react';

import { isPrototypePath, PATHS } from '../../app/paths.ts';

/** A desktop: a big window and a mouse or trackpad. Tablets (touch first) get the app full screen. */
const SHOWCASE_QUERY = '(min-width: 64rem) and (min-height: 40rem) and (hover: hover) and (pointer: fine)';
const STANDALONE_QUERY = '(display-mode: standalone)';
const ROUTE_MESSAGE = 'sprawnie:route';
const NAVIGATE_MESSAGE = 'sprawnie:navigate';

/** The phone's iframe name: a link with this target opens its page inside the phone. */
export const PHONE_FRAME = 'phone';

/** Id of the landing page's first section (the hero): the header's "Start" link goes there. */
export const HERO_ID = 'section-hero';

/** Id of the section with the working phone: the hero's button scrolls there. */
export const TRY_ID = 'wyprobuj';

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

/** This document shows a desktop page (landing or phone mockup), not the bare app. */
export function isDesktopPage(): boolean {
  return wideScreen() && !isEmbedded();
}

function subscribe(listener: () => void): () => void {
  const mql = window.matchMedia(SHOWCASE_QUERY);
  mql.addEventListener('change', listener);
  return () => mql.removeEventListener('change', listener);
}

export type PageKind = 'landing' | 'mockup' | 'app';

/** What this document renders; follows the window across the desktop breakpoint. */
export function usePageKind(): PageKind {
  const wide = useSyncExternalStore(subscribe, wideScreen, () => false);
  const { pathname } = window.location;
  if (!wide || isEmbedded()) {
    return 'app';
  }
  if (pathname === PATHS.landing) {
    return 'landing';
  }
  return isPrototypePath(pathname) ? 'mockup' : 'app';
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
