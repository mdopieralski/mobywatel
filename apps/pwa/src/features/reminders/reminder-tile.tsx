import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import { dueClass, dueUrgentClass, reminderBoxClass } from './reminder-classes.ts';
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
    <Link className={`${reminderBoxClass} min-h-target no-underline`} to={PATHS.reminders}>
      <span
        className="grid size-9 flex-none place-items-center rounded-[50%] bg-accent font-bold text-accent-text"
        aria-hidden="true"
      >
        {items.length}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]">
          {t('title')}:{' '}
        </span>
        <b className="text-md">{first.title}</b>
        <span className={dueClass}>
          <span className={first.reminder.urgent ? dueUrgentClass : undefined}>{first.due}</span>
          {items.length > 1 ? <> · {t('more', { count: items.length - 1 })}</> : null}
        </span>
      </span>
      <svg
        aria-hidden="true"
        className="flex-none fill-none stroke-text-muted stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <path d="m9.5 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
