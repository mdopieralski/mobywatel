import { useTranslations } from 'use-intl';

import { LineIcon, REMINDERS } from '../documents/kinds.tsx';
import styles from './reminders.module.css';
import { useReminders } from './use-reminders.ts';

/** Everything waiting for the persona, soonest first. Urgency is a word, not only a colour. */
export function RemindersScreen() {
  const t = useTranslations('documents.reminders');
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
    </div>
  );
}
