import { Disclaimer } from '@mobywatel/ui';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import { router } from '../../app/router.tsx';
import { useAppLocale } from '../../platform/i18n.ts';
import { useFollowPhoneSettings } from './follow-phone-settings.ts';
import { PhoneFrame } from './phone-frame.tsx';
import { HERO_ID, NEWS_ID, TECH_ID, onShowcaseRoute } from './showcase-mode.ts';
import { SiteHeader } from './site-header.tsx';
import './compact-font.css';
import styles from './showcase.module.css';

/**
 * Desktop /prototype/*: the app in a phone mockup and nothing else. The phone opens the URL the visitor
 * came in on, and the address bar follows the app, so every screen has a link of its own.
 */
export function PrototypePage() {
  const t = useTranslations('showcase');
  const tCommon = useTranslations('common');
  const locale = useAppLocale();
  const frame = useRef<HTMLIFrameElement>(null);
  const [src] = useState(() => window.location.pathname + window.location.search + window.location.hash);

  useEffect(
    () =>
      onShowcaseRoute(
        () => frame.current,
        // Through the router, not history alone: if the window narrows, the app it then renders here
        // starts on the same screen as the address bar.
        (path) => void router.navigate(path, { replace: true })
      ),
    []
  );
  useFollowPhoneSettings();

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        {tCommon('skipToContent')}
      </a>
      <SiteHeader
        links={[
          { href: `${PATHS.landing}#${HERO_ID}`, label: t('nav.start') },
          { href: PATHS.start, label: t('nav.prototype'), current: 'page' },
          { href: `${PATHS.landing}#${NEWS_ID}`, label: t('nav.news') },
          { href: `${PATHS.landing}#${TECH_ID}`, label: t('nav.tech') },
        ]}
      />
      <main id="main" tabIndex={-1} className={styles.mockup}>
        <h1 className={styles.visuallyHidden}>{t('nav.prototype')}</h1>
        {/* Above the phone, so it is on the first screen at every desktop size. */}
        <Disclaimer variant="inline" locale={locale} />
        <PhoneFrame ref={frame} src={src} onTitle={(title) => (document.title = title)} />
      </main>
    </div>
  );
}
