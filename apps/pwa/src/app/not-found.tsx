import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import styles from './not-found.module.css';
import { PATHS } from './paths.ts';

export function NotFound() {
  const t = useTranslations('common.notFound');
  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('body')}</p>
      <Link className={styles.back} to={PATHS.start}>
        <span aria-hidden="true">←</span> {t('back')}
      </Link>
    </>
  );
}
