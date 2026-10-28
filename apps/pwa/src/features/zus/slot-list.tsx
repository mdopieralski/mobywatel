import type { ZusOffice, ZusSlot } from '@mobywatel/content';
import type { Ref } from 'react';
import { useFormatter, useTranslations } from 'use-intl';

import { parseIsoDate } from '../../platform/persona.ts';
import { changeButtonClass, panelTitleClass, timeOptionClass } from '../travel/picker-classes.ts';
import { noteClass, zusPanelClass } from './zus-classes.ts';
import { DAY_FORMAT } from './zus-state.ts';

/** Step 2: free times at the chosen office, grouped by day. */
export function SlotList({
  office,
  slots,
  onChoose,
  onChangeOffice,
  headingRef,
  slotRef,
}: {
  office: ZusOffice;
  slots: readonly ZusSlot[];
  onChoose: (slot: ZusSlot) => void;
  onChangeOffice: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
  /** Lets the caller return focus to a slot after a cancel. */
  slotRef: (id: string, el: HTMLButtonElement | null) => void;
}) {
  const t = useTranslations('zus');
  const format = useFormatter();
  const days = [...new Set(slots.map((s) => s.dateIso))];
  return (
    <section className={zusPanelClass} aria-labelledby="zus-slots">
      <h2 id="zus-slots" ref={headingRef} tabIndex={-1} className={panelTitleClass}>
        {t('slots.title')}
      </h2>
      <p className={noteClass}>
        {t('offices.name', { name: office.name })}, {office.city}
      </p>
      {days.map((dateIso) => {
        const label = format.dateTime(parseIsoDate(dateIso), DAY_FORMAT);
        return (
          <div key={dateIso} className="grid gap-2 [&_h3]:m-0 [&_h3]:text-md">
            <h3>{label}</h3>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {slots
                .filter((s) => s.dateIso === dateIso)
                .map((slot) => (
                  <li key={slot.id}>
                    {/* The day is in the name, so a screen reader's button list makes sense on its own. */}
                    <button
                      type="button"
                      className={timeOptionClass}
                      aria-label={`${label}, ${slot.time}`}
                      ref={(el) => slotRef(slot.id, el)}
                      onClick={() => onChoose(slot)}
                    >
                      {slot.time}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        );
      })}
      <button type="button" className={changeButtonClass} onClick={onChangeOffice}>
        {t('slots.change')}
      </button>
    </section>
  );
}
