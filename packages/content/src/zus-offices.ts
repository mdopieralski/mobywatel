// Wizyta w ZUS: invented offices in real towns, and appointment slots that always lie in the future.
// Never real ZUS branch names or addresses (prototype-guardrails skill): the names are nicknames we made up.
import { resolveDate } from '@mobywatel/core';

export interface ZusOffice {
  id: string;
  /** Made-up nickname; the UI wraps it, e.g. "Placówka „Pod Zegarem”". */
  name: string;
  city: string;
}

export const ZUS_OFFICES: readonly ZusOffice[] = [
  { id: 'warszawa-park', name: 'Przy Parku', city: 'Warszawa' },
  { id: 'krakow-kopiec', name: 'Pod Kopcem', city: 'Kraków' },
  { id: 'lodz-przedzalnia', name: 'Stara Przędzalnia', city: 'Łódź' },
  { id: 'wroclaw-most', name: 'Przy Moście', city: 'Wrocław' },
  { id: 'gdansk-port', name: 'Przy Porcie', city: 'Gdańsk' },
  { id: 'lublin-brama', name: 'Przy Bramie', city: 'Lublin' },
  { id: 'kalisz-zegar', name: 'Pod Zegarem', city: 'Kalisz' },
  { id: 'olsztyn-jezioro', name: 'Nad Jeziorem', city: 'Olsztyn' },
];

export function zusOfficeById(id: string | null | undefined): ZusOffice | undefined {
  return ZUS_OFFICES.find((o) => o.id === id);
}

export interface ZusSlot {
  /** `${dateIso}T${time}`, unique. */
  id: string;
  /** Local calendar day, YYYY-MM-DD. */
  dateIso: string;
  /** HH:MM, local time. */
  time: string;
}

export const ZUS_SLOT_TIMES = ['09:00', '11:30', '14:00'] as const;

/** First and last working day offered, counted from today (3rd to 10th working day). */
export const ZUS_FIRST_WORKING_DAY = 3;
export const ZUS_LAST_WORKING_DAY = 10;

/** Fixed-date public holidays in Poland (MM-DD). Movable ones (Easter, Corpus Christi) fall outside judging. */
const HOLIDAYS = new Set([
  '01-01',
  '01-06',
  '05-01',
  '05-03',
  '08-15',
  '11-01',
  '11-11',
  '12-24',
  '12-25',
  '12-26',
]);

function isoDay(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Slots on the 3rd to the 10th working day after `today` (Monday to Friday, not a fixed public holiday),
 * three a day. Relative to today, so the demo never offers a past date during judging.
 */
export function zusSlots(today: Date): ZusSlot[] {
  const slots: ZusSlot[] = [];
  let working = 0;
  for (let days = 1; working < ZUS_LAST_WORKING_DAY; days++) {
    const day = resolveDate({ days }, today);
    const dateIso = isoDay(day);
    if (day.getDay() === 0 || day.getDay() === 6 || HOLIDAYS.has(dateIso.slice(5))) {
      continue;
    }
    working++;
    if (working >= ZUS_FIRST_WORKING_DAY) {
      for (const time of ZUS_SLOT_TIMES) {
        slots.push({ id: `${dateIso}T${time}`, dateIso, time });
      }
    }
  }
  return slots;
}
