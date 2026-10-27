import { WORKING_NAME } from '@mobywatel/brand';
import { type MouseEvent, useEffect } from 'react';
import { useTranslations } from 'use-intl';

import { AppMark } from '../../app/app-mark.tsx';
import { INTRO, introStyle, useIntroDelay } from '../../app/boot-loader.ts';
import intro from '../../app/intro.module.css';
import { PATHS } from '../../app/paths.ts';
import { warmCompactFontCache } from './compact-font-cache.ts';
import styles from './showcase.module.css';

export type HeaderLink = {
  href: string;
  label: string;
  /** "location": the section on screen (landing); "page": this page (/prototype). */
  current?: 'location' | 'page';
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Header of the desktop pages: our own icon and name (never official marks), then the nav. After the boot
 * loader the tick draws, the name appears, then each link in turn (INTRO).
 */
export function SiteHeader({ links }: { links: readonly HeaderLink[] }) {
  const t = useTranslations('showcase');
  const nameDelay = introStyle(useIntroDelay(INTRO.nameAt));
  const navDelay = useIntroDelay(INTRO.navAt);
  useEffect(warmCompactFontCache, []);
  return (
    <header className={styles.header}>
      <a className={styles.home} href={PATHS.landing}>
        <AppMark className={styles.logo} />
        <span className={`${styles.brandName} ${intro.reveal}`} style={nameDelay}>
          {WORKING_NAME}
        </span>
      </a>
      <nav className={styles.sectionNav} aria-label={t('nav.label')}>
        {links.map(({ href, label, current, onClick }, index) => (
          <a
            key={href}
            className={`${styles.sectionLink} ${intro.reveal}`}
            style={introStyle(navDelay + index * INTRO.navStepMs)}
            href={href}
            aria-current={current}
            onClick={onClick}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
