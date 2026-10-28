import type { CategoryId, MatterId } from '@mobywatel/content';
import { WORKING_NAME } from '@mobywatel/brand';
import { type ReactNode, type Ref, useSyncExternalStore } from 'react';
import { useTranslations } from 'use-intl';

import { INTRO, introStyle, useIntroDelay } from '../../app/boot-loader.ts';
import intro from '../../app/intro.module.css';
import { PATHS } from '../../app/paths.ts';
import { useAppLocale } from '../../platform/i18n.ts';
import { CATEGORY_VIEWS, MATTERS } from '../categories/categories.tsx';
import { HERO_ID, TRY_ID } from './showcase-mode.ts';
import styles from './showcase.module.css';

/** The globe from the header's language switch. */
const GLOBE_ICON = (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </>
);

type Highlight = { id: 'zus' | 'tickets' | 'languages' } & (
  { category: CategoryId; matter?: MatterId } | { icon: ReactNode }
);

/** What the hero puts first: a category, one matter in it (its icon), or a feature with its own icon. */
const HIGHLIGHTS: readonly Highlight[] = [
  { id: 'zus', category: 'zus' },
  { id: 'tickets', category: 'travel', matter: 'cityTicket' },
  { id: 'languages', icon: GLOBE_ICON },
];

function highlightIcon(highlight: Highlight): ReactNode {
  if ('icon' in highlight) {
    return highlight.icon;
  }
  if (highlight.matter) {
    return MATTERS[highlight.matter].icon;
  }
  return CATEGORY_VIEWS.find((c) => c.id === highlight.category)?.icon ?? null;
}

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
 * of the app.  `onTry` brings the phone into view.
 */
export function ShowcaseHero({ onTry, ref }: { onTry: () => void; ref?: Ref<HTMLElement> }) {
  const t = useTranslations('showcase.hero');
  const tShowcase = useTranslations('showcase');
  const showPreview = useShowPreview();
  const locale = useAppLocale();
  // Entrance after the header: each part rises in turn (INTRO.heroAt).
  const heroDelay = useIntroDelay(INTRO.heroAt);
  const rise = (step: number) => introStyle(heroDelay + step * INTRO.heroStepMs);
  return (
    <section
      id={HERO_ID}
      ref={ref}
      tabIndex={-1}
      className={`${styles.hero} ${styles.drawingGrid}`}
      aria-labelledby="showcase-hero"
    >
      {/* Centred across the whole hero, above the text and the preview. The label right under the
          headline says up front that this is not the official app. */}
      <div className={`${styles.heroHeading} ${intro.rise}`} style={rise(0)}>
        <h1 id="showcase-hero" className={styles.heroTitle}>
          {t.rich('title', { name: (chunks) => <span className={styles.heroName}>{chunks}</span> })}
        </h1>
        <p className={styles.heroBadge}>{t('badge')}</p>
      </div>
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <p className={`${styles.heroLead} ${intro.rise}`} style={rise(1)}>
            {t('lead')}
          </p>
          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((highlight, index) => {
              const { id } = highlight;
              const icon = highlightIcon(highlight);
              if (!icon) {
                return null;
              }
              return (
                <li key={id} className={`${styles.highlight} ${intro.rise}`} style={rise(2 + index)}>
                  <svg
                    className={styles.highlightIcon}
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                  >
                    {icon}
                  </svg>
                  <h2 className={styles.highlightTitle}>{t(`${id}.title`)}</h2>
                  <p className={styles.highlightBody}>{t(`${id}.body`)}</p>
                </li>
              );
            })}
          </ul>{' '}
        </div>

        {/* A look at the app: the start screen, where ZUS and Tickets already are. Only a picture: it can't
            be focused or clicked, and screen readers skip it (the working phone is below). */}
        {showPreview ? (
          <div className={`${styles.preview} ${intro.rise}`} style={rise(1)} aria-hidden="true" inert>
            <div className={styles.previewScreen}>
              {/* key: a language picked in the working phone reloads this picture in that language. */}
              <iframe
                key={locale}
                className={styles.previewApp}
                src={PATHS.start}
                title={tShowcase('phoneLabel', { name: WORKING_NAME })}
                tabIndex={-1}
              />
            </div>
          </div>
        ) : null}
      </div>
      {/* Centred across the whole hero, under the text and the preview. */}
      <a
        className={`${styles.heroCta} ${intro.rise}`}
        style={rise(2 + HIGHLIGHTS.length)}
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
    </section>
  );
}
