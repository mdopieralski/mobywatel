import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';

import { LineIcon, REMINDERS } from '../documents/kinds.tsx';
import styles from './reminders.module.css';
import { useReminders } from './use-reminders.ts';

/** Everything waiting for the persona, soonest first. Urgency is a word, not only a colour. */
export function RemindersScreen() {
  const t = useTranslations('documents.reminders');
  const tSoon = useTranslations('soon');
  const items = useReminders();
  return (
    <div className={styles.stack}>
      <h1>{t('title')}</h1>
      <ul className={styles.list}>
        {items.map(({ reminder, title, due }) => (
          <li key={reminder.id} className={styles.item}>
            <span className={styles.itemIcon}>
              <LineIcon>{REMINDERS[reminder.kind].icon}</LineIcon>
            </span>
            <span className={styles.text}>
              <b>{title}</b>
              <span className={reminder.urgent ? styles.dueUrgent : styles.line}>{due}</span>
            </span>
            {reminder.urgent ? <span className={styles.urgent}>{t('urgent')}</span> : null}
          </li>
        ))}
      </ul>
      <p className={styles.hint}>{t('hint')}</p>
      {/* A way back, and a keyboard stop inside the scroll area, so arrow keys can scroll a long list. */}
      <Link className={styles.back} to={PATHS.start}>
        <span aria-hidden="true">←</span> {tSoon('back')}
      </Link>
    </div>
  );
}
