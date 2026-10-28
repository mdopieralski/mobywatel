import { DOCUMENT_WATERMARK } from '@mobywatel/brand';
import { Disclaimer } from '@mobywatel/ui';
import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router';
import { useFormatter, useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import { NotFound } from '../../app/not-found.tsx';
import { useAppLocale } from '../../platform/i18n.ts';
import { parseIsoDate, usePersona } from '../../platform/persona.ts';
import { categoryOfDocument } from '../categories/categories.tsx';
import { DATE_FORMAT, DocumentFace } from './document-card.tsx';
import { cardClass, detailRowClass, detailsClass, documentClass } from './document-classes.ts';
import { kindBySlug, KINDS } from './kinds.tsx';

// Back to the category the document lives in (start screen if none).
function backTo(kind: Parameters<typeof categoryOfDocument>[0]): string {
  const category = categoryOfDocument(kind);
  return category ? `${PATHS.categories}/${category.slug}` : PATHS.start;
}

/** One document as an information card: watermark and disclaimer, never a presentable credential. */
export function DocumentScreen() {
  const t = useTranslations('documents');
  const format = useFormatter();
  const locale = useAppLocale();
  const persona = usePersona();
  const kind = kindBySlug(useParams().kind);
  const doc = persona.documents.find((d) => d.kind === kind);
  if (!kind || !doc) {
    return <NotFound />;
  }
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 [&_h1]:m-0">
      <Link
        className="inline-flex min-h-target items-center gap-2 justify-self-start font-semibold"
        to={backTo(kind)}
      >
        <span aria-hidden="true">←</span> {t('back')}
      </Link>
      <h1>{t(`kinds.${KINDS[kind].key}`)}</h1>
      {/* The watermark ("PROTOTYP – nie jest dokumentem") is drawn by CSS from data-watermark, so no screenshot
          of this looks real. Polish on purpose (docs/decisions/languages-2026-10-25.md); the disclaimer below
          says the same in the UI language. */}
      <div className={documentClass} data-watermark={DOCUMENT_WATERMARK}>
        <div
          className={`${cardClass} min-h-28 overflow-hidden px-5 py-4`}
          style={{ '--card-color': KINDS[kind].color } as CSSProperties}
        >
          <DocumentFace doc={doc} persona={persona} full={false} proto />
        </div>
        <section aria-labelledby="details-heading" className={detailsClass}>
          <h2 id="details-heading">{t('details')}</h2>
          <dl>
            {doc.fields.map(([key, value]) => (
              <div key={key} className={detailRowClass}>
                <dt>{t(`fields.${key}`)}</dt>
                <dd>
                  {'date' in value ? format.dateTime(parseIsoDate(value.date), DATE_FORMAT) : value.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <Disclaimer variant="inline" locale={locale} />
    </div>
  );
}
