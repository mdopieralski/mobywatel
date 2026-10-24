import { Disclaimer } from '@mobywatel/ui';
import { useTranslations } from 'use-intl';

import styles from './route-error.module.css';

// Replaces React Router's English developer screen. A juror who hits a bug still sees Polish,
// the disclaimer and a way back. Plain <a> (full reload) because the router may be broken.
export function RouteError() {
  const t = useTranslations('common.error');
  return (
    <main className={styles.page}>
      <h1>{t('title')}</h1>
      <p>{t('body')}</p>
      <p>
        <a href="/">{t('back')}</a>
      </p>
      <Disclaimer variant="inline" />
    </main>
  );
}
