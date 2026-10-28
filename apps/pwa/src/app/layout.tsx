import { WORKING_NAME } from '@mobywatel/brand';
import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useTranslations } from 'use-intl';

import { UpdatePrompt } from '../pwa/update-prompt.tsx';
import { AppMark } from './app-mark.tsx';
import { INTRO, introStyle, useIntroDelay } from './boot-loader.ts';
import { introReveal } from './intro.ts';
import { LanguageSwitch } from './language-switch.tsx';
import { PATHS } from './paths.ts';
import { visuallyHidden } from './visually-hidden.ts';

// Header shortcuts, our own line icons (24 px grid). Each opens a screen, even before its feature exists.
const SHORTCUTS = [
  {
    to: PATHS.inbox,
    label: 'inbox',
    icon: <path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5M5.5 5h13l2 8.5V19h-17v-5.5z" />,
  },
  {
    to: PATHS.notifications,
    label: 'notifications',
    icon: <path d="M18 16.5H6l1.5-2.5v-4a4.5 4.5 0 0 1 9 0v4zM10 19.5a2 2 0 0 0 4 0" />,
  },
] as const;

/*
 * Phone-first. On wider screens the app sits in a phone-sized column (the jury may open it on a laptop);
 * on tablets (touch, wide) a wider column. Desktop with a mouse, without the showcase (installed on a
 * desktop, or the showcase is off): a phone-sized preview, 390×844 like an iPhone 13–16 screen, centred.
 * Same pointer test as the showcase (showcase-mode.ts), so a touch tablet keeps the full-height column.
 * Never taller than the window, so the tab bar is always on screen.
 * Short windows (a phone on its side, 400% zoom): a pinned header and tab bar would leave almost no room
 * for the screen, so the whole page scrolls instead, header and tab bar with it (WCAG 1.4.10).
 */
const frameClass =
  'flex flex-col h-dvh max-w-[30rem] mx-auto bg-bg pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] ' +
  'min-[40rem]:border-x min-[40rem]:border-border min-[48rem]:max-w-[45rem] ' +
  '[@media(min-width:64rem)_and_(min-height:40rem)_and_(hover:hover)_and_(pointer:fine)]:w-[390px] ' +
  '[@media(min-width:64rem)_and_(min-height:40rem)_and_(hover:hover)_and_(pointer:fine)]:max-w-none ' +
  '[@media(min-width:64rem)_and_(min-height:40rem)_and_(hover:hover)_and_(pointer:fine)]:h-[min(844px,calc(100dvh_-_2_*_var(--space-6)))] ' +
  '[@media(min-width:64rem)_and_(min-height:40rem)_and_(hover:hover)_and_(pointer:fine)]:my-6 ' +
  '[@media(min-width:64rem)_and_(min-height:40rem)_and_(hover:hover)_and_(pointer:fine)]:border ' +
  '[@media(min-width:64rem)_and_(min-height:40rem)_and_(hover:hover)_and_(pointer:fine)]:border-border ' +
  '[@media(min-width:64rem)_and_(min-height:40rem)_and_(hover:hover)_and_(pointer:fine)]:rounded-lg ' +
  '[@media(min-width:64rem)_and_(min-height:40rem)_and_(hover:hover)_and_(pointer:fine)]:overflow-hidden ' +
  '[@media(max-height:30rem)]:h-auto [@media(max-height:30rem)]:min-h-dvh [@media(max-height:30rem)]:max-w-[48rem]';

/*
 * Positioned, so visually hidden labels (position: absolute) stay inside this scroll area. Without it they
 * anchor to the page and stretch it, and the whole app scrolls away from the tab bar. A focused item
 * scrolls clear of the start screen's pinned prompt bar (WCAG 2.4.11). No outline on the programmatic
 * focus of main and the screen's heading.
 */
const mainClass =
  'relative flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-pb-[6rem] p-4 focus:outline-none [&_h1:focus]:outline-none ' +
  '[@media(max-height:30rem)]:flex-none [@media(max-height:30rem)]:overflow-visible';

/* Very narrow (320 px, or senior text): the name hides visually, so the header stays one row. It still
   names the home link for screen readers. */
const nameClass =
  'text-lg font-bold leading-tight tracking-[-0.01em] ' +
  '[@media(max-width:23rem)]:absolute [@media(max-width:23rem)]:w-px [@media(max-width:23rem)]:h-px [@media(max-width:23rem)]:overflow-hidden [@media(max-width:23rem)]:[clip-path:inset(50%)] [@media(max-width:23rem)]:whitespace-nowrap';

/* Current screen: accent colour plus a tint, so it isn't colour alone. */
const shortcutClass = ({ isActive }: { isActive: boolean }) =>
  'inline-flex items-center justify-center min-w-target min-h-target rounded-md no-underline hover:bg-accent-soft ' +
  '[&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.75] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] ' +
  (isActive ? 'text-accent bg-accent-soft' : 'text-text');

/* Current tab: accent colour plus a bar on top. */
const navClass = ({ isActive }: { isActive: boolean }) =>
  'flex items-center justify-center min-h-target p-2 font-semibold no-underline focus-visible:outline-offset-[-3px] ' +
  (isActive ? 'text-accent [box-shadow:inset_0_3px_0_var(--accent)]' : 'text-text-muted');

export function Layout() {
  const t = useTranslations('common');
  const main = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const shown = useRef(pathname);
  const onSettings = pathname === PATHS.settings || pathname.startsWith(`${PATHS.settings}/`);

  // Title per screen (WCAG 2.4.2), also after a language switch.
  useEffect(() => {
    const screen = main.current?.querySelector('h1')?.firstChild?.textContent?.trim();
    document.title =
      screen && screen !== WORKING_NAME
        ? `${screen} – ${WORKING_NAME}`
        : t('appTitle', { name: WORKING_NAME });
  }, [pathname, t]);

  // Route change: focus the new heading so screen readers announce it (not on first load: the browser
  // handles that). Compared by path, not a first-run flag: StrictMode runs effects twice in dev, and a
  // stray focus inside the showcase's phone scrolls the whole page down to it.
  useEffect(() => {
    if (shown.current === pathname) {
      return;
    }
    shown.current = pathname;
    const heading = main.current?.querySelector<HTMLElement>('h1');
    heading?.setAttribute('tabindex', '-1');
    // Inside the landing page's phone, focusing must not scroll the outer page down to the phone.
    heading?.focus({ preventScroll: window.self !== window.top });
  }, [pathname]);

  // Header entrance after the boot loader: name, then each shortcut in turn (INTRO).
  const nameDelay = introStyle(useIntroDelay(INTRO.nameAt));
  const navDelay = useIntroDelay(INTRO.navAt);
  const revealAt = (index: number) => introStyle(navDelay + index * INTRO.navStepMs);

  return (
    <div className={frameClass}>
      <a
        className="absolute left-2 top-[-100px] z-10 py-3 px-4 bg-surface text-accent rounded-sm focus:top-2"
        href="#main"
      >
        {t('skipToContent')}
      </a>
      <header className="flex flex-wrap items-center justify-between gap-2 pt-[calc(env(safe-area-inset-top)_+_var(--space-2))] pr-3 pb-2 pl-4">
        {/* Home: our own icon and name (never official marks). */}
        <Link
          className="flex items-center gap-3 min-h-target text-text no-underline rounded-md"
          to={PATHS.start}
        >
          {/* Same rounding as the icon's tile (112 of 512). */}
          <AppMark className="flex-none size-10 rounded-[22%]" />
          <span className={`${nameClass} ${introReveal}`} style={nameDelay}>
            {WORKING_NAME}
          </span>
        </Link>
        <nav className="flex items-center" aria-label={t('header.actions')}>
          {SHORTCUTS.map(({ to, label, icon }, index) => (
            <NavLink
              key={to}
              to={to}
              className={(state) => `${shortcutClass(state)} ${introReveal}`}
              style={revealAt(index)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                {icon}
              </svg>
              <span className={visuallyHidden}>{t(`header.${label}`)}</span>
            </NavLink>
          ))}
          {/* Visible in every language, so the switch is findable without reading the UI. */}
          <LanguageSwitch variant="app" className={introReveal} style={revealAt(SHORTCUTS.length)} />
        </nav>
      </header>
      <main id="main" ref={main} className={mainClass} tabIndex={-1}>
        <Outlet />
      </main>
      <nav
        className="shrink-0 grid grid-flow-col auto-cols-fr border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
        aria-label={t('mainNavigation')}
      >
        {/* Start stays marked on every screen but Settings, so the tab bar always shows where you are. */}
        <Link
          to={PATHS.start}
          className={navClass({ isActive: !onSettings })}
          aria-current={pathname === PATHS.start ? 'page' : onSettings ? undefined : 'true'}
        >
          {t('nav.start')}
        </Link>
        <NavLink to={PATHS.settings} className={navClass}>
          {t('nav.settings')}
        </NavLink>
      </nav>
      <UpdatePrompt />
    </div>
  );
}
