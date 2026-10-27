import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import styles from './coming-soon-screen.module.css';

export type ComingSoon = 'inbox' | 'notifications' | 'assistant';

/** A header shortcut whose feature isn't built yet: says what will be here, never a dead end. */
export function ComingSoonScreen({ screen }: { screen: ComingSoon }) {
  const t = useTranslations('soon');
  return (
    <div className={styles.stack}>
      <h1>{t(`${screen}.title`)}</h1>
      <p className={styles.badge}>{t('badge')}</p>
      <p>{t(`${screen}.body`)}</p>
      <Link className={styles.back} to={PATHS.start}>
        {t('back')}
      </Link>
    </div>
  );
}
