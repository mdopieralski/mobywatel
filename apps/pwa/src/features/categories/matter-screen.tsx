import type { MatterId } from '@mobywatel/content';
import type { CSSProperties, ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslations } from 'use-intl';

import { NotFound } from '../../app/not-found.tsx';
import { PATHS } from '../../app/paths.ts';
import { LineIcon } from '../documents/kinds.tsx';
import { CityPicker } from '../travel/city-picker.tsx';
import { ZusVisit } from '../zus/zus-visit.tsx';
import {
  backLinkClass,
  badgeClass,
  descriptionClass,
  headingClass,
  rowIconClass,
  screenClass,
  soonClass,
} from './category-classes.ts';
import { categoryBySlug, MATTERS, matterBySlug } from './categories.tsx';

/** Matters you can walk through to the end. Every other one says it is coming ("Wkrótce"). */
const BUILT: Partial<Record<MatterId, () => ReactNode>> = {
  cityTicket: () => <CityPicker />,
  zusVisit: () => <ZusVisit />,
};

/**
 * One matter from a category's submenu. A built one shows its flow; the rest say what they will do and
 * that they are coming, with a way back to the category. Never a look-alike of an official flow (e.g. no
 * ID verification screen; prototype-guardrails skill).
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
  const built = BUILT[matter];
  return (
    <div className={screenClass} style={{ '--card-color': category.color } as CSSProperties}>
      <Link className={backLinkClass} to={`${PATHS.categories}/${category.slug}`}>
        <span aria-hidden="true">←</span> {t(`names.${category.id}`)}
      </Link>
      <div className={headingClass}>
        <span className={rowIconClass}>
          <LineIcon size={28}>{MATTERS[matter].icon}</LineIcon>
        </span>
        <h1>{t(`matters.names.${matter}`)}</h1>
      </div>
      {built ? null : <p className={badgeClass}>{tSoon('badge')}</p>}
      <p className={descriptionClass}>{t(`matters.descriptions.${matter}`)}</p>
      {built ? built() : <p className={soonClass}>{t('matters.soon')}</p>}
    </div>
  );
}
