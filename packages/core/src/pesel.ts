// PESEL helpers for FICTIONAL demo personas only (prototype-guardrails skill).
// Numbers have a valid checksum so validation code is realistic, but they are generated from
// invented birth dates and serials and must never be taken from a real person.

const WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3] as const;

export type Sex = 'K' | 'M';

export interface BirthDate {
  year: number;
  month: number;
  day: number;
}

/** Month offset per century: 1800s +80, 1900s +0, 2000s +20, 2100s +40, 2200s +60. */
const CENTURY_OFFSET: ReadonlyArray<readonly [century: number, offset: number]> = [
  [1800, 80],
  [1900, 0],
  [2000, 20],
  [2100, 40],
  [2200, 60],
];

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

function isRealDate({ year, month, day }: BirthDate): boolean {
  if (![year, month, day].every(Number.isInteger) || month < 1 || month > 12 || day < 1) {
    return false;
  }
  return day <= new Date(year, month, 0).getDate();
}

export function peselChecksum(first10: string): number {
  if (!/^\d{10}$/.test(first10)) {
    throw new Error('peselChecksum needs 10 digits');
  }
  const sum = [...first10].reduce((acc, d, i) => acc + Number(d) * (WEIGHTS[i] ?? 0), 0);
  return (10 - (sum % 10)) % 10;
}

/** Birth date encoded in a PESEL, or null when the digits don't form a real date. */
export function peselBirthDate(pesel: string): BirthDate | null {
  if (!/^\d{6}/.test(pesel)) {
    return null;
  }
  const yy = Number(pesel.slice(0, 2));
  const mm = Number(pesel.slice(2, 4));
  const day = Number(pesel.slice(4, 6));
  const entry = CENTURY_OFFSET.find(([, offset]) => mm > offset && mm <= offset + 12);
  if (!entry) {
    return null;
  }
  const birth = { year: entry[0] + yy, month: mm - entry[1], day };
  return isRealDate(birth) ? birth : null;
}

/** Format, checksum and a real encoded birth date. */
export function isValidPesel(pesel: string): boolean {
  return (
    /^\d{11}$/.test(pesel) &&
    peselBirthDate(pesel) !== null &&
    peselChecksum(pesel.slice(0, 10)) === Number(pesel[10])
  );
}

/**
 * Builds a checksum-valid PESEL for a fictional persona.
 * `serial` (0–999) is the invented ordinal part; the sex digit is derived from `sex`.
 */
export function fictionalPesel(birth: BirthDate, sex: Sex, serial: number): string {
  if (!isRealDate(birth)) {
    throw new Error(`not a real date: ${birth.year}-${birth.month}-${birth.day}`);
  }
  const entry = CENTURY_OFFSET.find(([century]) => birth.year >= century && birth.year < century + 100);
  if (!entry) {
    throw new Error(`year ${birth.year} out of PESEL range (1800–2299)`);
  }
  if (!Number.isInteger(serial) || serial < 0 || serial > 999) {
    throw new Error('serial must be 0–999');
  }
  const sexDigit = sex === 'K' ? 0 : 1; // even = woman, odd = man
  const first10 =
    pad(birth.year % 100) + pad(birth.month + entry[1]) + pad(birth.day) + pad(serial, 3) + String(sexDigit);
  return first10 + String(peselChecksum(first10));
}
