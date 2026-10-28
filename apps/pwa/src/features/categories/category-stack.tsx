import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import { cardClass, cardIconClass, cardTitleClass } from '../documents/document-classes.ts';
import { LineIcon } from '../documents/kinds.tsx';
import { CATEGORY_VIEWS } from './categories.tsx';

/*
 * Square: at least as tall as a column is wide (100cqi of the wrapper). When text is large (senior mode,
 * 200% zoom) the card grows instead of clipping, and its row neighbour grows with it. At tablet width three
 * columns, so the tiles stay card-sized; senior mode keeps two bigger ones. A hover lift where there is hover.
 */
const tileClass = [
  cardClass,
  'min-w-0 px-3 py-4 min-h-[calc((100cqi-var(--space-5))/2)]',
  '[@container(min-width:36rem)]:not-senior:min-h-[calc((100cqi-2*var(--space-5))/3)]',
  'focus-visible:z-1 focus-visible:outline-offset-3',
  '[@media(hover:hover)]:transition-transform [@media(hover:hover)]:duration-(--duration-base) [@media(hover:hover)]:ease-standard hover:-translate-y-1',
].join(' ');

/**
 * The start-screen grid: one square card per category (the user's list and order), two per row. A card
 * shows only its icon and name (user choice 2026-10-26); the category screen lists what is inside.
 */
export function CategoryStack() {
  const t = useTranslations('categories');
  return (
    // The wrapper is the size container: a container query can't restyle the container itself.
    <div className="@container">
      {/* Two columns of square cards, 20 px apart (user choice 2026-10-26); three at tablet width. */}
      <ul
        className="m-0 grid list-none grid-cols-2 gap-5 p-0 [@container(min-width:36rem)]:not-senior:grid-cols-3"
        aria-label={t('title')}
      >
        {CATEGORY_VIEWS.map((category) => (
          <li key={category.id} className="grid min-w-0">
            <Link
              to={`${PATHS.categories}/${category.slug}`}
              className={tileClass}
              style={{ '--card-color': category.color } as CSSProperties}
            >
              <span className={cardIconClass}>
                <LineIcon size={28}>{category.icon}</LineIcon>
              </span>
              {/* Name at the bottom. One step smaller than a full card, so "Bezpieczeństwo" fits on one line. */}
              <span className={`${cardTitleClass} mt-auto min-w-0 text-md wrap-anywhere hyphens-auto`}>
                {t(`names.${category.id}`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
