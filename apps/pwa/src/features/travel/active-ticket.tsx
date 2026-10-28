import { DOCUMENT_WATERMARK } from '@mobywatel/brand';
import { Disclaimer } from '@mobywatel/ui';
import { type Ref, useState } from 'react';
import { useFormatter, useTranslations } from 'use-intl';

import { useAppLocale } from '../../platform/i18n.ts';
import { detailRowClass, detailsClass, documentClass } from '../documents/document-classes.ts';
import { flowClass, mutedClass } from './picker-classes.ts';
import { type BoughtTicket, TIME_FORMAT, validUntil } from './ticket-state.ts';

/**
 * The bought ticket, on the same screen. Treated like a document view: the "PROTOTYP – nie jest dokumentem"
 * watermark and the disclaimer, so it can never be shown to a ticket inspector as a real one.
 */
export function ActiveTicket({
  ticket,
  cityName,
  ref,
}: {
  ticket: BoughtTicket;
  cityName: string;
  ref?: Ref<HTMLHeadingElement>;
}) {
  const t = useTranslations('tickets');
  const format = useFormatter();
  const locale = useAppLocale();
  // Checked when the ticket is shown; enough for a demo (no live countdown).
  const [now] = useState(() => Date.now());
  const until = validUntil(ticket);
  const expired = until !== null && until.getTime() < now;
  const rows: [string, string][] = [
    [t('active.city'), cityName],
    [t('active.ticket'), t(`names.${ticket.ticketId}`)],
    [t('active.boughtAt'), format.dateTime(new Date(ticket.boughtAtIso), TIME_FORMAT)],
    [t('active.validUntil'), until ? format.dateTime(until, TIME_FORMAT) : t('active.oneRide')],
  ];
  return (
    <div className={flowClass}>
      <div className={documentClass} data-watermark={DOCUMENT_WATERMARK}>
        <section aria-labelledby="active-ticket" className={detailsClass}>
          <h2 id="active-ticket" ref={ref} tabIndex={-1}>
            {t('active.title')}
          </h2>
          <dl>
            {rows.map(([label, value]) => (
              <div key={label} className={detailRowClass}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {expired ? <p className="font-bold text-danger">{t('active.expired')}</p> : null}
          <p className={mutedClass}>{t('active.note')}</p>
        </section>
      </div>
      <Disclaimer variant="inline" locale={locale} />
    </div>
  );
}
