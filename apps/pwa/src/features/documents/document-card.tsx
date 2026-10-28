import type { Persona, PersonaDocument } from '@mobywatel/core';
import { useFormatter, useTranslations } from 'use-intl';

import { parseIsoDate } from '../../platform/persona.ts';
import { cardIconClass, cardTitleClass } from './document-classes.ts';
import { KINDS, LineIcon } from './kinds.tsx';

export const DATE_FORMAT = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
/** Near-term deadlines: day and month only, like "28.10". */
export const SHORT_DATE_FORMAT = { day: '2-digit', month: '2-digit' } as const;

/** Status line, e.g. "Ważny do 20.05.2031". */
export function useDocumentStatus() {
  const t = useTranslations('documents');
  const format = useFormatter();
  return (doc: PersonaDocument) => {
    const key = KINDS[doc.kind].key;
    const date = doc.statusDate ? format.dateTime(parseIsoDate(doc.statusDate), DATE_FORMAT) : '';
    return t(`status.${key}`, { date });
  };
}

/**
 * The face of a document card: our own flat design, never official artwork. Shows the name, status and,
 * on the ID card, initials instead of a photo and only the first name (details on the next screen).
 */
export function DocumentFace({
  doc,
  persona,
  full,
  proto = full,
}: {
  doc: PersonaDocument;
  persona: Persona;
  /** The front card of the wallet: shows the person. */
  full: boolean;
  /** The "PROTOTYP" label: always on the front card and on the document screen. */
  proto?: boolean;
}) {
  const t = useTranslations('documents');
  const tc = useTranslations('common');
  const status = useDocumentStatus();
  const kind = KINDS[doc.kind];
  return (
    <>
      <span className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 flex-col gap-0.5 wrap-anywhere">
          <span className={`${cardTitleClass} text-lg`}>{t(`kinds.${kind.key}`)}</span>
          <span className="text-sm opacity-92">{status(doc)}</span>
        </span>
        <span className="flex flex-none flex-col items-end gap-2">
          <span className={cardIconClass}>
            <LineIcon size={28}>{kind.icon}</LineIcon>
          </span>
          {proto ? (
            <span className="text-xs font-bold tracking-[0.08em] uppercase opacity-85">
              {tc('prototypeBadge')}
            </span>
          ) : null}
        </span>
      </span>
      {full && doc.kind === 'id-card' ? (
        <span className="mt-auto flex items-end gap-4">
          <span
            className="grid h-[4.75em] w-[4em] flex-none place-items-center rounded-md bg-[color:color-mix(in_srgb,var(--text)_8%,transparent)] text-lg font-bold tracking-[0.04em]"
            aria-hidden="true"
          >
            {persona.firstName[0]}
            {persona.lastName[0]}
          </span>
          <span className="flex min-w-0 flex-col items-start gap-2 wrap-anywhere">
            <span className="text-xl font-bold tracking-[0.04em] uppercase">{persona.firstName}</span>
            <span className="rounded-pill border border-[color:color-mix(in_srgb,var(--text)_55%,transparent)] px-3 py-1 text-sm font-semibold">
              {t('showData')}
            </span>
          </span>
        </span>
      ) : null}
    </>
  );
}
