import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';

import { lineIconsClass } from '../documents/document-classes.ts';
import { LineIcon, REMINDERS } from '../documents/kinds.tsx';
import { dueClass, dueUrgentClass, reminderBoxClass } from './reminder-classes.ts';
import { useReminders } from './use-reminders.ts';

/** Everything waiting for the persona, soonest first. Urgency is a word, not only a colour. */
export function RemindersScreen() {
  const t = useTranslations('documents.reminders');
  const tSoon = useTranslations('soon');
  const items = useReminders();
  return (
    <div className="grid gap-4 [&_h1]:m-0 [&_p]:m-0">
      <h1>{t('title')}</h1>
      <ul className="m-0 grid list-none gap-3 p-0">
        {items.map(({ reminder, title, due }) => (
          <li key={reminder.id} className={reminderBoxClass}>
            <span
              className={`grid size-11 flex-none place-items-center rounded-md bg-accent-soft text-accent ${lineIconsClass}`}
            >
              <LineIcon>{REMINDERS[reminder.kind].icon}</LineIcon>
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <b>{title}</b>
              <span className={reminder.urgent ? dueUrgentClass : dueClass}>{due}</span>
            </span>
            {reminder.urgent ? (
              <span className="flex-none rounded-pill bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
                {t('urgent')}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="text-text-muted">{t('hint')}</p>
      {/* A way back, and a keyboard stop inside the scroll area, so arrow keys can scroll a long list. */}
      <Link className="inline-flex min-h-target items-center gap-2 font-semibold" to={PATHS.start}>
        <span aria-hidden="true">←</span> {tSoon('back')}
      </Link>
    </div>
  );
}
