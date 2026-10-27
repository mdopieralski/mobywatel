import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import styles from './start-screen.module.css';

/**
 * Looks like the reference's prompt bar, but is a link: there is no text field until the assistant exists,
 * so nobody can type real data into it (prototype-guardrails skill).
 */
export function AskBar() {
  const t = useTranslations('documents');
  return (
    <Link className={styles.ask} to={PATHS.assistant}>
      <span className={styles.askText}>{t('ask')}</span>
      <svg aria-hidden="true" className={styles.askMic} viewBox="0 0 24 24" width="24" height="24">
        <rect x="9" y="3.5" width="6" height="11" rx="3" />
        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" />
      </svg>
      <span className={styles.askGo} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path d="M12 18.5v-13M6.5 11 12 5.5l5.5 5.5" />
        </svg>
      </span>
    </Link>
  );
}
