import { TAGLINE, WORKING_NAME } from '@mobywatel/brand';
import { Disclaimer } from '@mobywatel/ui';
import { Link, useLocation } from 'react-router';
import { useTranslations } from 'use-intl';

import styles from './start-screen.module.css';

// Start screen placeholder. Personas and matters arrive after the product-manager picks them.
export function StartScreen() {
  const t = useTranslations('home');
  const demoReset = (useLocation().state as { demoReset?: boolean } | null)?.demoReset === true;
  return (
    <div className={styles.stack}>
      <p role="status" className={demoReset ? styles.notice : styles.empty}>
        {demoReset ? t('demoReset') : ''}
      </p>
      <h1>
        {WORKING_NAME}
        <span className={styles.tagline}>{TAGLINE}</span>
      </h1>
      <Disclaimer />
      <section className={styles.card} aria-labelledby="next-heading">
        <h2 id="next-heading">{t('comingSoon.title')}</h2>
        <p>{t('comingSoon.body')}</p>
        <Link to="/ustawienia">{t('comingSoon.settingsLink')}</Link>
      </section>
    </div>
  );
}
