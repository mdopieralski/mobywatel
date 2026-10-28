import { TARIFF_CHECKED_ON, TICKETS, type TicketId, type TicketType } from '@mobywatel/content';
import { ConfirmCard } from '@mobywatel/ui';
import { useEffect, useRef, useState } from 'react';
import { useFormatter, useTranslations } from 'use-intl';

import { parseIsoDate } from '../../platform/persona.ts';
import { DATE_FORMAT } from '../documents/document-card.tsx';
import { ActiveTicket } from './active-ticket.tsx';
import {
  mutedClass,
  optionClass,
  optionListClass,
  optionMetaClass,
  optionNameClass,
  panelClass,
  panelTitleClass,
} from './picker-classes.ts';
import { type BoughtTicket, readTicket, saveTicket } from './ticket-state.ts';

type Focus = { to: 'ticket'; id: TicketId } | { to: 'active' } | null;

/**
 * Bilet miejski after the town is chosen: the four tickets, a confirm card, then the bought ticket. Nothing
 * is paid and nothing leaves the phone; the ticket is kept in demo state so it survives a reload.
 */
export function TicketShop({
  cityId,
  cityName,
  nameOf,
}: {
  cityId: string;
  cityName: string;
  /** Town name for a ticket bought in another town than the one chosen now. */
  nameOf: (cityId: string) => string | undefined;
}) {
  const t = useTranslations('tickets');
  const format = useFormatter();
  const [bought, setBought] = useState<BoughtTicket | null>(readTicket);
  const [choosing, setChoosing] = useState<TicketType | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const buttons = useRef(new Map<TicketId, HTMLButtonElement>());
  const activeHeading = useRef<HTMLHeadingElement>(null);
  const focus = useRef<Focus>(null);

  // After cancel: back to the ticket that was chosen. After buying: the bought ticket.
  useEffect(() => {
    const target = focus.current;
    focus.current = null;
    if (target?.to === 'ticket') {
      buttons.current.get(target.id)?.focus();
    } else if (target?.to === 'active') {
      activeHeading.current?.focus();
    }
  }, [choosing, bought]);

  const price = (ticket: TicketType) =>
    format.number(ticket.priceGrosz / 100, { style: 'currency', currency: 'PLN' });

  // One live region that stays mounted, so "Nic nie zostało wysłane" is announced after cancel.
  const status = (
    <p role="status" className={mutedClass}>
      {cancelled ? t('cancelled') : ''}
    </p>
  );

  const body = choosing ? (
    <ConfirmCard
      title={t('confirm.title', { city: cityName })}
      rows={[
        { label: t('confirm.city'), value: cityName },
        { label: t('confirm.ticket'), value: t(`names.${choosing.id}`) },
        { label: t('confirm.validity'), value: t(`validity.${choosing.id}`) },
        { label: t('confirm.price'), value: price(choosing) },
        { label: t('confirm.payment'), value: t('confirm.paymentValue') },
      ]}
      source={{
        name: t('confirm.source'),
        checkedOn: t('confirm.checkedOn', {
          date: format.dateTime(parseIsoDate(TARIFF_CHECKED_ON), DATE_FORMAT),
        }),
      }}
      actionLabel={t('confirm.action')}
      onConfirm={() => {
        const ticket = { cityId, ticketId: choosing.id, boughtAtIso: new Date().toISOString() };
        saveTicket(ticket);
        setBought(ticket);
        setChoosing(null);
        focus.current = { to: 'active' };
      }}
      cancelLabel={t('confirm.cancel')}
      onCancel={() => {
        setChoosing(null);
        setCancelled(true);
        focus.current = { to: 'ticket', id: choosing.id };
      }}
    />
  ) : (
    <>
      {bought ? (
        <ActiveTicket ref={activeHeading} ticket={bought} cityName={nameOf(bought.cityId) ?? cityName} />
      ) : null}
      <section className={panelClass} aria-labelledby="ticket-list">
        <h2 id="ticket-list" className={panelTitleClass}>
          {bought ? t('anotherTitle') : t('listTitle')}
        </h2>
        <ul className={optionListClass}>
          {TICKETS.map((ticket) => (
            <li key={ticket.id}>
              <button
                type="button"
                className={optionClass}
                ref={(el) => {
                  if (el) buttons.current.set(ticket.id, el);
                  else buttons.current.delete(ticket.id);
                }}
                onClick={() => {
                  setCancelled(false);
                  setChoosing(ticket);
                }}
              >
                <span className={optionNameClass}>{t(`names.${ticket.id}`)}</span>
                <span className={optionMetaClass}>
                  {t(`validity.${ticket.id}`)} · {price(ticket)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );

  return (
    <>
      {body}
      {status}
    </>
  );
}
