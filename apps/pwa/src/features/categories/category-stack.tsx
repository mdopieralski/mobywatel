import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import { cardStyles } from '../documents/document-card.tsx';
import { LineIcon } from '../documents/kinds.tsx';
import { CATEGORY_VIEWS } from './categories.tsx';
import styles from './category-stack.module.css';

/**
 * The start-screen grid: one square card per category (the user's list and order), two per row. A card
 * shows only its icon and name (user choice 2026-10-26); the category screen lists what is inside.
 */
export function CategoryStack() {
  const t = useTranslations('categories');
  return (
    // The wrapper is the size container: a container query can't restyle the container itself.
    <div className={styles.wrap}>
      <ul className={styles.stack} aria-label={t('title')}>
        {CATEGORY_VIEWS.map((category) => (
          <li key={category.id} className={styles.item}>
            <Link
              to={`${PATHS.categories}/${category.slug}`}
              className={`${cardStyles.card} ${styles.card}`}
              style={{ '--card-color': category.color } as CSSProperties}
            >
              <span className={cardStyles.icon}>
                <LineIcon size={28}>{category.icon}</LineIcon>
              </span>
              <span className={`${cardStyles.title} ${styles.name}`}>{t(`names.${category.id}`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
