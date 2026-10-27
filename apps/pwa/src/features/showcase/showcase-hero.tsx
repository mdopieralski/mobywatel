import type { CategoryId, MatterId } from '@mobywatel/content';
import { WORKING_NAME } from '@mobywatel/brand';
import { Disclaimer } from '@mobywatel/ui';
import { useSyncExternalStore } from 'react';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import { useAppLocale } from '../../platform/i18n.ts';
import { CATEGORY_VIEWS, MATTERS } from '../categories/categories.tsx';
import { PHONE_FRAME, TRY_ID } from './showcase-mode.ts';
import styles from './showcase.module.css';

/** What the hero puts first, and where its link opens in the phone: a category, or one matter in it. */
const HIGHLIGHTS: readonly { id: 'zus' | 'tickets'; category: CategoryId; matter?: MatterId }[] = [
  { id: 'zus', category: 'zus' },
  { id: 'tickets', category: 'travel', matter: 'cityTicket' },
];

/** Same breakpoint as the CSS that drops the preview: below it, the preview is not even loaded. */
const NARROW = '(max-width: 72rem)';

function useShowPreview(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(NARROW);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => !window.matchMedia(NARROW).matches,
    () => false
  );
}

/**
 * First screen of the showcase: ZUS and city tickets are what is new in this prototype, next to a preview
 * of the app. `openInPhone` moves the app in the working phone below (without reloading it) and brings it
 * into view; without it, the link just reloads the phone's frame. `onTry` brings the phone into view.
 */
export function ShowcaseHero({
  openInPhone,
  onTry,
}: {
  openInPhone: (path: string) => boolean;
  onTry: () => void;
}) {
  const t = useTranslations('showcase.hero');
  const tShowcase = useTranslations('showcase');
  const locale = useAppLocale();
  const showPreview = useShowPreview();
  return (
    <section className={styles.hero} aria-labelledby="showcase-hero">
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          {/* Visibly unofficial from the first screen (prototype-guardrails skill). */}
          <p className={styles.badge}>{tShowcase('badge')}</p>
          <h1 id="showcase-hero" className={styles.heroTitle}>
            {t('title')}
          </h1>
          <p className={styles.heroLead}>{t('lead')}</p>
          <ul className={styles.highlights}>
            {HIGHLIGHTS.map(({ id, category: categoryId, matter }) => {
              const category = CATEGORY_VIEWS.find((c) => c.id === categoryId);
              if (!category) {
                return null;
              }
              const path = `${PATHS.categories}/${category.slug}${matter ? `/${MATTERS[matter].slug}` : ''}`;
              return (
                <li key={id} className={styles.highlight}>
                  <svg
                    className={styles.highlightIcon}
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                  >
                    {matter ? MATTERS[matter].icon : category.icon}
                  </svg>
                  <h2 className={styles.highlightTitle}>{t(`${id}.title`)}</h2>
                  <p className={styles.highlightBody}>{t(`${id}.body`)}</p>
                  <a
                    className={styles.highlightLink}
                    href={path}
                    target={PHONE_FRAME}
                    onClick={(event) => {
                      if (openInPhone(path)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    {t('open', { name: t(`${id}.title`) })}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className={styles.heroActions}>
            <a
              className={styles.heroCta}
              href={`#${TRY_ID}`}
              onClick={(event) => {
                event.preventDefault();
                onTry();
              }}
            >
              {t('cta')}
              <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
            <Disclaimer variant="inline" locale={locale} />
          </div>
        </div>

        {/* A look at the app: the start screen, where ZUS and Tickets already are. Only a picture: it can't
            be focused or clicked, and screen readers skip it (the working phone is below). */}
        {showPreview ? (
          <div className={styles.preview} aria-hidden="true" inert>
            <div className={styles.previewScreen}>
              <iframe
                className={styles.previewApp}
                src="/"
                title={tShowcase('phoneLabel', { name: WORKING_NAME })}
                tabIndex={-1}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
