import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslations } from 'use-intl';

import { NotFound } from '../../app/not-found.tsx';
import { PATHS } from '../../app/paths.ts';
import { usePersona } from '../../platform/persona.ts';
import { useDocumentStatus } from '../documents/document-card.tsx';
import { KINDS, LineIcon, REMINDERS } from '../documents/kinds.tsx';
import { useReminders } from '../reminders/use-reminders.ts';
import { categoryBySlug, MATTERS } from './categories.tsx';
import styles from './category-screen.module.css';

/** One category: what it covers, the persona's documents and matters in it, and what comes next. */
export function CategoryScreen() {
  const t = useTranslations('categories');
  const td = useTranslations('documents');
  const persona = usePersona();
  const status = useDocumentStatus();
  const category = categoryBySlug(useParams().category);
  const reminders = useReminders();
  if (!category) {
    return <NotFound />;
  }
  const docs = persona.documents.filter((d) => category.documents.includes(d.kind));
  const matters = reminders.filter((r) => category.reminders.includes(r.reminder.kind));
  return (
    <div className={styles.stack} style={{ '--card-color': category.color } as CSSProperties}>
      <Link className={styles.back} to={PATHS.start}>
        <span aria-hidden="true">←</span> {t('back')}
      </Link>
      <div className={styles.heading}>
        <span className={styles.icon}>
          <LineIcon size={28}>{category.icon}</LineIcon>
        </span>
        <h1>{t(`names.${category.id}`)}</h1>
      </div>
      <p className={styles.description}>{t(`descriptions.${category.id}`)}</p>

      {category.matters.length ? (
        <nav aria-labelledby="category-matters">
          <h2 id="category-matters">{t('matters.title')}</h2>
          <ul className={styles.list}>
            {category.matters.map((matter) => (
              <li key={matter}>
                <Link
                  className={styles.row}
                  to={`${PATHS.categories}/${category.slug}/${MATTERS[matter].slug}`}
                >
                  <span className={styles.rowIcon}>
                    <LineIcon>{MATTERS[matter].icon}</LineIcon>
                  </span>
                  <span className={styles.rowText}>
                    <b>{t(`matters.names.${matter}`)}</b>
                  </span>
                  <svg
                    aria-hidden="true"
                    className={styles.chevron}
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path d="m9.5 6 6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {docs.length ? (
        <section aria-labelledby="category-documents">
          <h2 id="category-documents">{t('documents')}</h2>
          <ul className={styles.list}>
            {docs.map((doc) => (
              <li key={doc.kind}>
                <Link className={styles.row} to={`${PATHS.documents}/${KINDS[doc.kind].slug}`}>
                  <span
                    className={styles.rowIcon}
                    style={{ '--card-color': KINDS[doc.kind].color } as CSSProperties}
                  >
                    <LineIcon>{KINDS[doc.kind].icon}</LineIcon>
                  </span>
                  <span className={styles.rowText}>
                    <b>{td(`kinds.${KINDS[doc.kind].key}`)}</b>
                    <span>{status(doc)}</span>
                  </span>
                  <svg
                    aria-hidden="true"
                    className={styles.chevron}
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path d="m9.5 6 6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {matters.length ? (
        <section aria-labelledby="category-reminders">
          <h2 id="category-reminders">{t('reminders')}</h2>
          <ul className={styles.list}>
            {matters.map(({ reminder, title, due }) => (
              <li key={reminder.id} className={styles.row}>
                <span className={styles.rowIcon}>
                  <LineIcon>{REMINDERS[reminder.kind].icon}</LineIcon>
                </span>
                <span className={styles.rowText}>
                  <b>{title}</b>
                  <span>{due}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {category.matters.length ? null : <p className={styles.soon}>{t('soon')}</p>}
    </div>
  );
}
