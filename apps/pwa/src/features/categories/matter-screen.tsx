import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslations } from 'use-intl';

import { NotFound } from '../../app/not-found.tsx';
import { PATHS } from '../../app/paths.ts';
import { LineIcon } from '../documents/kinds.tsx';
import { CityPicker } from '../travel/city-picker.tsx';
import { categoryBySlug, MATTERS, matterBySlug } from './categories.tsx';
import styles from './category-screen.module.css';

/**
 * One matter from a category's submenu. None is built yet, so the screen says what it will do and that
 * it is coming, with a way back to the category. Never a look-alike of an official flow (e.g. no ID
 * verification screen; prototype-guardrails skill).
 */
export function MatterScreen() {
  const t = useTranslations('categories');
  const tSoon = useTranslations('soon');
  const params = useParams();
  const category = categoryBySlug(params.category);
  const matter = category ? matterBySlug(category, params.matter) : undefined;
  if (!category || !matter) {
    return <NotFound />;
  }
  return (
    <div className={styles.stack} style={{ '--card-color': category.color } as CSSProperties}>
      <Link className={styles.back} to={`${PATHS.categories}/${category.slug}`}>
        <span aria-hidden="true">←</span> {t(`names.${category.id}`)}
      </Link>
      <div className={styles.heading}>
        <span className={styles.rowIcon}>
          <LineIcon size={28}>{MATTERS[matter].icon}</LineIcon>
        </span>
        <h1>{t(`matters.names.${matter}`)}</h1>
      </div>
      <p className={styles.badge}>{tSoon('badge')}</p>
      <p className={styles.description}>{t(`matters.descriptions.${matter}`)}</p>
      {/* Bilet miejski already lets you pick your town; the rest only says it is coming. */}
      {matter === 'cityTicket' ? <CityPicker /> : <p className={styles.soon}>{t('matters.soon')}</p>}
    </div>
  );
}
