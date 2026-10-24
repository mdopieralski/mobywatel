import { describe, expect, it } from 'vitest';

import { addDays, daysUntil, resolveDate, urgencyOf } from './dates.ts';
import { fictionalPesel, isValidPesel, peselBirthDate, peselChecksum } from './pesel.ts';

describe('pesel', () => {
  it('computes the checksum with the official weights', () => {
    // 4405140135 → weighted sum 101 → check digit 9 (the textbook example 44051401359)
    expect(peselChecksum('4405140135')).toBe(9);
  });

  it('generates valid numbers with the right century and sex digit', () => {
    const k = fictionalPesel({ year: 1991, month: 7, day: 14 }, 'K', 427);
    expect(k).toMatch(/^910714427\d{2}$/);
    expect(Number(k[9]) % 2).toBe(0);
    expect(isValidPesel(k)).toBe(true);

    const m = fictionalPesel({ year: 2005, month: 3, day: 2 }, 'M', 12);
    expect(m.slice(0, 6)).toBe('052302');
    expect(Number(m[9]) % 2).toBe(1);
    expect(isValidPesel(m)).toBe(true);
  });

  it('rejects malformed input and impossible dates', () => {
    expect(isValidPesel('123')).toBe(false);
    expect(isValidPesel('00000000000')).toBe(false); // checksum ok, month 00 is not a date
    expect(() => fictionalPesel({ year: 1990, month: 1, day: 1 }, 'K', 1000)).toThrow();
    expect(() => fictionalPesel({ year: 1990, month: 13, day: 1 }, 'K', 1)).toThrow();
    expect(() => fictionalPesel({ year: 2023, month: 2, day: 29 }, 'K', 1)).toThrow();
    expect(() => fictionalPesel({ year: 1799, month: 1, day: 1 }, 'K', 1)).toThrow();
  });

  it('round-trips the birth date across centuries', () => {
    for (const birth of [
      { year: 1888, month: 12, day: 31 },
      { year: 1999, month: 1, day: 1 },
      { year: 2024, month: 2, day: 29 },
      { year: 2150, month: 6, day: 15 },
    ]) {
      const p = fictionalPesel(birth, 'M', 5);
      expect(isValidPesel(p)).toBe(true);
      expect(peselBirthDate(p)).toEqual(birth);
    }
  });
});

describe('dates', () => {
  const today = new Date(2026, 9, 24, 15, 30); // 24.10.2026 afternoon

  it('resolves relative dates from today in calendar days', () => {
    expect(resolveDate({ days: 11 }, today)).toEqual(new Date(2026, 10, 4));
    expect(daysUntil(addDays(today, 11), today)).toBe(11);
  });

  it('is DST-safe (last Sunday of October)', () => {
    expect(daysUntil(new Date(2026, 9, 26), new Date(2026, 9, 24, 23, 59))).toBe(2);
  });

  it('bands urgency', () => {
    expect(urgencyOf(-1)).toBe('overdue');
    expect(urgencyOf(0)).toBe('soon');
    expect(urgencyOf(14)).toBe('soon');
    expect(urgencyOf(30)).toBe('upcoming');
    expect(urgencyOf(90)).toBe('later');
  });
});
