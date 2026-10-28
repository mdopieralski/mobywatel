import { type ZusOffice, type ZusSlot, zusOfficeById, zusSlots } from '@mobywatel/content';
import { ConfirmCard } from '@mobywatel/ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormatter, useTranslations } from 'use-intl';

import { parseIsoDate } from '../../platform/persona.ts';
import docStyles from '../documents/document-screen.module.css';
import { DATE_FORMAT } from '../documents/document-card.tsx';
import { OfficeList } from './office-list.tsx';
import { SlotList } from './slot-list.tsx';
import {
  clearBooking,
  DAY_FORMAT,
  fictionalReference,
  readBooking,
  saveBooking,
  type ZusBooking,
} from './zus-state.ts';
import styles from './zus.module.css';

type Step =
  | { step: 'office' }
  | { step: 'slot'; office: ZusOffice }
  | { step: 'confirm'; office: ZusOffice; slot: ZusSlot };

type Focus = 'heading' | { slot: string } | null;

/**
 * Wizyta w ZUS: pick an invented office, a free time, confirm, and the visit is booked with an obviously
 * fictional number. Nothing leaves the phone; the booking is kept in demo state so it survives a reload.
 */
export function ZusVisit() {
  const t = useTranslations('zus');
  const format = useFormatter();
  const [booking, setBooking] = useState<ZusBooking | null>(readBooking);
  const [step, setStep] = useState<Step>({ step: 'office' });
  const [cancelled, setCancelled] = useState(false);
  // Today, once per visit to the screen: the slots and the "Stan na" date use the same day.
  const [today] = useState(() => new Date());
  const slots = useMemo(() => zusSlots(today), [today]);
  const heading = useRef<HTMLHeadingElement>(null);
  const slotButtons = useRef(new Map<string, HTMLButtonElement>());
  const focus = useRef<Focus>(null);

  // Each step starts at its heading; after a cancel, focus goes back to the time that was chosen.
  useEffect(() => {
    const target = focus.current;
    focus.current = null;
    if (target === 'heading') {
      heading.current?.focus();
    } else if (target) {
      slotButtons.current.get(target.slot)?.focus();
    }
  }, [step, booking]);

  const go = (next: Step) => {
    setCancelled(false);
    setStep(next);
    focus.current = 'heading';
  };
  const day = (dateIso: string) => format.dateTime(parseIsoDate(dateIso), DAY_FORMAT);
  const office = booking ? zusOfficeById(booking.officeId) : undefined;

  let body;
  if (booking && office) {
    const rows: [string, string][] = [
      [t('booked.office'), `${t('offices.name', { name: office.name })}, ${office.city}`],
      [t('booked.date'), day(booking.dateIso)],
      [t('booked.time'), booking.time],
    ];
    body = (
      <section className={styles.panel} aria-labelledby="zus-booked">
        <h2 id="zus-booked" ref={heading} tabIndex={-1} className={styles.title}>
          {t('booked.title')}
        </h2>
        <p className={styles.note}>{t('booked.reference')}</p>
        <p className={styles.reference}>{booking.reference}</p>
        <dl>
          {rows.map(([label, value]) => (
            <div key={label} className={docStyles.row}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>{t('booked.note')}</p>
        <button
          type="button"
          className={styles.change}
          onClick={() => {
            clearBooking();
            setBooking(null);
            go({ step: 'office' });
          }}
        >
          {t('booked.another')}
        </button>
      </section>
    );
  } else if (step.step === 'confirm') {
    const { office: chosen, slot } = step;
    body = (
      <ConfirmCard
        title={t('confirm.title')}
        rows={[
          {
            label: t('confirm.office'),
            value: `${t('offices.name', { name: chosen.name })}, ${chosen.city}`,
          },
          { label: t('confirm.date'), value: day(slot.dateIso) },
          { label: t('confirm.time'), value: slot.time },
          { label: t('confirm.matter'), value: t('confirm.matterValue') },
        ]}
        source={{
          name: t('confirm.source'),
          checkedOn: t('confirm.checkedOn', { date: format.dateTime(today, DATE_FORMAT) }),
        }}
        actionLabel={t('confirm.action')}
        onConfirm={() => {
          const next = {
            officeId: chosen.id,
            dateIso: slot.dateIso,
            time: slot.time,
            reference: fictionalReference(),
          };
          saveBooking(next);
          setBooking(next);
          setStep({ step: 'office' });
          focus.current = 'heading';
        }}
        cancelLabel={t('confirm.cancel')}
        onCancel={() => {
          setStep({ step: 'slot', office: chosen });
          setCancelled(true);
          focus.current = { slot: slot.id };
        }}
      />
    );
  } else if (step.step === 'slot') {
    const { office: chosen } = step;
    body = (
      <SlotList
        office={chosen}
        slots={slots}
        headingRef={heading}
        slotRef={(id, el) => {
          if (el) slotButtons.current.set(id, el);
          else slotButtons.current.delete(id);
        }}
        onChoose={(slot) => {
          setCancelled(false);
          setStep({ step: 'confirm', office: chosen, slot });
        }}
        onChangeOffice={() => go({ step: 'office' })}
      />
    );
  } else {
    body = <OfficeList headingRef={heading} onChoose={(chosen) => go({ step: 'slot', office: chosen })} />;
  }

  return (
    <div className={styles.flow}>
      {body}
      {/* One live region that stays mounted, so "Nic nie zostało wysłane" is announced after cancel. */}
      <p role="status" className={styles.note}>
        {cancelled ? t('cancelled') : ''}
      </p>
    </div>
  );
}
