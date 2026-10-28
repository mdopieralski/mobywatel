import type { ZusOffice, ZusSlot } from '@mobywatel/content';
import type { Ref } from 'react';
import { useFormatter, useTranslations } from 'use-intl';

import { parseIsoDate } from '../../platform/persona.ts';
import { DAY_FORMAT } from './zus-state.ts';
import styles from './zus.module.css';

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
    <section className={styles.panel} aria-labelledby="zus-slots">
      <h2 id="zus-slots" ref={headingRef} tabIndex={-1} className={styles.title}>
        {t('slots.title')}
      </h2>
      <p className={styles.note}>
        {t('offices.name', { name: office.name })}, {office.city}
      </p>
      {days.map((dateIso) => {
        const label = format.dateTime(parseIsoDate(dateIso), DAY_FORMAT);
        return (
          <div key={dateIso} className={styles.day}>
            <h3>{label}</h3>
            <ul className={styles.times}>
              {slots
                .filter((s) => s.dateIso === dateIso)
                .map((slot) => (
                  <li key={slot.id}>
                    {/* The day is in the name, so a screen reader's button list makes sense on its own. */}
                    <button
                      type="button"
                      className={styles.time}
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
      <button type="button" className={styles.change} onClick={onChangeOffice}>
        {t('slots.change')}
      </button>
    </section>
  );
}
