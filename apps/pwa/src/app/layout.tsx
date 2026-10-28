import { WORKING_NAME } from '@mobywatel/brand';
import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useTranslations } from 'use-intl';

import { UpdatePrompt } from '../pwa/update-prompt.tsx';
import { AppMark } from './app-mark.tsx';
import { INTRO, introStyle, useIntroDelay } from './boot-loader.ts';
import intro from './intro.module.css';
import { LanguageSwitch } from './language-switch.tsx';
import styles from './layout.module.css';
import { PATHS } from './paths.ts';

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

export function Layout() {
  const t = useTranslations('common');
  const main = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const shown = useRef(pathname);

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
    heading?.focus();
  }, [pathname]);

  // Header entrance after the boot loader: name, then each shortcut in turn (INTRO).
  const nameDelay = introStyle(useIntroDelay(INTRO.nameAt));
  const navDelay = useIntroDelay(INTRO.navAt);
  const revealAt = (index: number) => introStyle(navDelay + index * INTRO.navStepMs);

  const shortcutClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.shortcut} ${styles.shortcutActive}` : styles.shortcut;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

  return (
    <div className={styles.frame}>
      <a className={styles.skip} href="#main">
        {t('skipToContent')}
      </a>
      <header className={styles.header}>
        {/* Home: our own icon and name (never official marks). */}
        <Link className={styles.home} to={PATHS.start}>
          <AppMark className={styles.logo} />
          <span className={`${styles.name} ${intro.reveal}`} style={nameDelay}>
            {WORKING_NAME}
          </span>
        </Link>
        <nav className={styles.shortcuts} aria-label={t('header.actions')}>
          {SHORTCUTS.map(({ to, label, icon }, index) => (
            <NavLink
              key={to}
              to={to}
              className={(state) => `${shortcutClass(state)} ${intro.reveal}`}
              style={revealAt(index)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                {icon}
              </svg>
              <span className={styles.visuallyHidden}>{t(`header.${label}`)}</span>
            </NavLink>
          ))}
          {/* Visible in every language, so the switch is findable without reading the UI. */}
          <LanguageSwitch variant="app" className={intro.reveal} style={revealAt(SHORTCUTS.length)} />
        </nav>
      </header>
      <main id="main" ref={main} className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <nav className={styles.nav} aria-label={t('mainNavigation')}>
        <NavLink to={PATHS.start} end className={navClass}>
          {t('nav.start')}
        </NavLink>
        <NavLink to={PATHS.settings} className={navClass}>
          {t('nav.settings')}
        </NavLink>
      </nav>
      <UpdatePrompt />
    </div>
  );
}
