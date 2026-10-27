import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import styles from './reminders.module.css';
import { useReminders } from './use-reminders.ts';

/** Start-screen summary: the most urgent matter and how many more. The link name includes the deadline. */
export function ReminderTile() {
  const t = useTranslations('documents.reminders');
  const items = useReminders();
  const [first] = items;
  if (!first) {
    return null;
  }
  return (
    <Link className={styles.tile} to={PATHS.reminders}>
      <span className={styles.count} aria-hidden="true">
        {items.length}
      </span>
      <span className={styles.text}>
        <span className={styles.visuallyHidden}>{t('title')}: </span>
        <b className={styles.tileTitle}>{first.title}</b>
        <span className={styles.line}>
          <span className={first.reminder.urgent ? styles.dueUrgent : undefined}>{first.due}</span>
          {items.length > 1 ? <> · {t('more', { count: items.length - 1 })}</> : null}
        </span>
      </span>
      <svg aria-hidden="true" className={styles.chevron} viewBox="0 0 24 24" width="20" height="20">
        <path d="m9.5 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
