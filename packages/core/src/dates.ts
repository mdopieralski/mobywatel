// Demo dates are stored RELATIVE to "today" so reminders never go stale during judging
// (domain-engineer). Work in local calendar days, not milliseconds, to avoid DST off-by-one.

/** A date relative to today, e.g. { days: 11 } = eleven days from now. */
export interface RelativeDate {
  days: number;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, days: number): Date {
  const r = startOfDay(d);
  r.setDate(r.getDate() + days);
  return r;
}

/** "Today" is always passed in (never `new Date()` in core) so the app can inject a demo clock. */
export type Clock = () => Date;

export function resolveDate(rel: RelativeDate, today: Date): Date {
  return addDays(today, rel.days);
}

/** Whole calendar days from `today` to `target` (negative when past). */
export function daysUntil(target: Date, today: Date): number {
  const a = startOfDay(today);
  const b = startOfDay(target);
  return Math.round(
    (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
      86_400_000
  );
}

export type Urgency = 'overdue' | 'soon' | 'upcoming' | 'later';

/** Urgency bands for reminder tiles; always shown with text, never colour alone. */
export function urgencyOf(days: number): Urgency {
  if (days < 0) return 'overdue';
  if (days <= 14) return 'soon';
  if (days <= 60) return 'upcoming';
  return 'later';
}
