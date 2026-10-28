/* Class lists shared by the start-screen tile and the reminders screen (docs/decisions/tailwind-2026-10-28.md). */

/** The tile on the start screen and each item on the reminders screen. */
export const reminderBoxClass =
  'flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-text';

/** The deadline line. Urgency is also a word ("Pilne"), not only this colour. */
export const dueClass = 'text-sm text-text-muted';
export const dueUrgentClass = 'text-sm font-bold text-accent';
