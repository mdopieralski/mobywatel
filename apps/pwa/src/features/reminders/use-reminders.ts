import { resolveDate, type Reminder } from '@mobywatel/core';
import { useFormatter, useTranslations } from 'use-intl';

import { usePersona, useToday } from '../../platform/persona.ts';
import { SHORT_DATE_FORMAT } from '../documents/document-card.tsx';
import { REMINDERS } from '../documents/kinds.tsx';

export interface ReminderView {
  reminder: Reminder;
  title: string;
  due: string;
}

/** The persona's reminders, soonest first, with text in the UI language. */
export function useReminders(): ReminderView[] {
  const t = useTranslations('documents.reminders');
  const format = useFormatter();
  const persona = usePersona();
  const today = useToday();
  return [...persona.reminders]
    .sort((a, b) => a.due.days - b.due.days)
    .map((reminder) => {
      const key = REMINDERS[reminder.kind].key;
      const date = format.dateTime(resolveDate(reminder.due, today), SHORT_DATE_FORMAT);
      return { reminder, title: t(`kinds.${key}`), due: t(`due.${key}`, { date }) };
    });
}
