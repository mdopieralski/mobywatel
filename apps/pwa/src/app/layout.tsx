import { WORKING_NAME } from '@mobywatel/brand';
import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { useTranslations } from 'use-intl';

import { UpdatePrompt } from '../pwa/update-prompt.tsx';
import styles from './layout.module.css';

export function Layout() {
  const t = useTranslations('common');
  const main = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const first = useRef(true);

  // Route change: title per screen (WCAG 2.4.2), and focus on the new heading so screen readers
  // announce it (not on first load: the browser handles that).
  useEffect(() => {
    const heading = main.current?.querySelector<HTMLElement>('h1');
    const screen = heading?.firstChild?.textContent?.trim();
    document.title =
      screen && screen !== WORKING_NAME ? `${screen} – ${WORKING_NAME}` : `${WORKING_NAME} (prototyp)`;
    if (first.current) {
      first.current = false;
      return;
    }
    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
  }, [pathname]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

  return (
    <div className={styles.frame}>
      <a className={styles.skip} href="#main">
        {t('skipToContent')}
      </a>
      <header className={styles.header}>
        <span className={styles.brand}>{WORKING_NAME}</span>
        <span className={styles.badge}>{t('prototypeBadge')}</span>
      </header>
      <main id="main" ref={main} className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <nav className={styles.nav} aria-label={t('mainNavigation')}>
        <NavLink to="/" end className={navClass}>
          {t('nav.start')}
        </NavLink>
        <NavLink to="/ustawienia" className={navClass}>
          {t('nav.settings')}
        </NavLink>
      </nav>
      <UpdatePrompt />
    </div>
  );
}
