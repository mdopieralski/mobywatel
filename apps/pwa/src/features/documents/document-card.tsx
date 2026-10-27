import type { Persona, PersonaDocument } from '@mobywatel/core';
import { useFormatter, useTranslations } from 'use-intl';

import { parseIsoDate } from '../../platform/persona.ts';
import styles from './document-card.module.css';
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
      <span className={styles.head}>
        <span className={styles.titles}>
          <span className={styles.title}>{t(`kinds.${kind.key}`)}</span>
          <span className={styles.status}>{status(doc)}</span>
        </span>
        <span className={styles.side}>
          <span className={styles.icon}>
            <LineIcon size={28}>{kind.icon}</LineIcon>
          </span>
          {proto ? <span className={styles.proto}>{tc('prototypeBadge')}</span> : null}
        </span>
      </span>
      {full && doc.kind === 'id-card' ? (
        <span className={styles.person}>
          <span className={styles.avatar} aria-hidden="true">
            {persona.firstName[0]}
            {persona.lastName[0]}
          </span>
          <span className={styles.personText}>
            <span className={styles.firstName}>{persona.firstName}</span>
            <span className={styles.reveal}>{t('showData')}</span>
          </span>
        </span>
      ) : null}
    </>
  );
}

export { styles as cardStyles };
