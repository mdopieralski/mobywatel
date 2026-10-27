// Desktop showcase: on a wide screen the start URL shows a page with the app inside a phone frame
// (an iframe of the same URL). Phones, installed apps and the framed copy itself get the app directly.
import { useSyncExternalStore } from 'react';

const SHOWCASE_QUERY = '(min-width: 64rem) and (min-height: 40rem)';
const STANDALONE_QUERY = '(display-mode: standalone)';
const ROUTE_MESSAGE = 'sprawnie:route';
const NAVIGATE_MESSAGE = 'sprawnie:navigate';

/** The phone's iframe name: a link with this target opens its page inside the phone. */
export const PHONE_FRAME = 'phone';

/** Id of the section with the working phone: the hero's button scrolls there. */
export const TRY_ID = 'wyprobuj';

export function isEmbedded(): boolean {
  return typeof window !== 'undefined' && window.self !== window.top;
}

function wideScreen(): boolean {
  return window.matchMedia(SHOWCASE_QUERY).matches && !window.matchMedia(STANDALONE_QUERY).matches;
}

function subscribe(listener: () => void): () => void {
  const mql = window.matchMedia(SHOWCASE_QUERY);
  mql.addEventListener('change', listener);
  return () => mql.removeEventListener('change', listener);
}

/** True when this document should render the showcase page instead of the app. */
export function useShowcaseMode(fullPagePaths: readonly string[]): boolean {
  const wide = useSyncExternalStore(subscribe, wideScreen, () => false);
  return wide && !isEmbedded() && !fullPagePaths.includes(window.location.pathname);
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
      data.path.startsWith('/')
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
      data.path.startsWith('/')
    ) {
      handle(data.path);
    }
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
