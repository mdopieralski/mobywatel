import type { CategoryId, MatterId } from '@mobywatel/content';
import { WORKING_NAME } from '@mobywatel/brand';
import { type ReactNode, type Ref, useSyncExternalStore } from 'react';
import { useTranslations } from 'use-intl';

import { INTRO, introStyle, useIntroDelay } from '../../app/boot-loader.ts';
import { introRise } from '../../app/intro.ts';
import { PATHS } from '../../app/paths.ts';
import { useAppLocale } from '../../platform/i18n.ts';
import { CATEGORY_VIEWS, MATTERS } from '../categories/categories.tsx';
import { drawingGridClass, strokeIconClass } from './showcase-classes.ts';
import { HERO_ID, TRY_ID } from './showcase-mode.ts';

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

/** Same breakpoint as the CSS that drops the preview: below it, the preview is not even loaded. Written
    out as `[@media(max-width:72rem)]:` in the classes below. */
const NARROW = '(max-width: 72rem)';

/*
 * Hero: a full-width band right under the header. It fills the first screen and leads with what the
 * prototype adds: ZUS and city tickets. One centred column, 9 of 12 columns wide. 120 px top and bottom like
 * the other sections where the window is tall enough; less on short laptop screens, so the button and the
 * disclaimer stay on the first screen. White in the light theme, under the drawing grid.
 */
const heroClass = `grid grid-cols-[minmax(0,calc(100%*9/12))] justify-center items-center content-center gap-12 min-h-[calc(100dvh_-_var(--header-height))] py-[clamp(var(--space-7),9vh,var(--space-9))] px-12 border-b border-border bg-surface ${drawingGridClass}`;

/*
 * Icon on the left, as tall as the title and the description together (square); both texts start at the
 * same line to its right.
 */
const highlightClass =
  '[--title-line:calc(var(--font-xl)*var(--line-height-tight))] [--body-line:calc(var(--font-md)*var(--line-height-body))] grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-1 p-5 border-2 border-border rounded-lg bg-surface';

const highlightIconClass = `row-[1/3] box-border size-[calc(var(--title-line)_+_var(--space-1)_+_var(--body-line))] p-3 rounded-md bg-accent text-accent-text ${strokeIconClass}`;

/* App preview: the real app, scaled down in a plain bezel (near-black with an outline in the dark theme).
   Dropped on narrow desktop windows: the working phone is right below. */
const previewClass =
  '[--preview-scale:0.78] [--preview-bezel:var(--text)] p-3 rounded-[3rem] bg-(--preview-bezel) [box-shadow:0_2rem_4rem_-1.5rem_color-mix(in_srgb,var(--text)_45%,transparent)] dark:[--preview-bezel:var(--bg)] dark:[box-shadow:0_0_0_2px_var(--border-strong)] [@media(max-width:72rem)]:hidden';

/* Same space above the app as the working phone's status bar (3rem), so the app's header clears the rounded
   corners. The camera island sits in it. */
const previewScreenClass =
  '[--preview-bar:3rem] relative box-border w-[calc(390px*var(--preview-scale))] h-[calc(844px*var(--preview-scale))] pt-[calc(var(--preview-bar)*var(--preview-scale))] overflow-hidden rounded-[calc(3rem_-_var(--space-3))] bg-bg before:absolute before:top-[calc(var(--space-3)*var(--preview-scale))] before:left-1/2 before:w-[calc(6.5rem*var(--preview-scale))] before:h-[calc(1.75rem*var(--preview-scale))] before:[transform:translateX(-50%)] before:rounded-pill before:bg-(--preview-bezel)';

/* The main action: down to the working phone. Centred across the whole hero. */
const ctaClass =
  'justify-self-center inline-flex items-center gap-3 min-h-[calc(var(--target-min)_+_var(--space-3))] px-6 rounded-pill bg-accent text-accent-text text-lg font-bold no-underline hover:bg-[color-mix(in_srgb,var(--accent)_88%,var(--text))] focus-visible:outline-offset-3';

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
    <section id={HERO_ID} ref={ref} tabIndex={-1} className={heroClass} aria-labelledby="showcase-hero">
      {/* Centred across the whole hero, above the text and the preview. The label right under the
          headline says up front that this is not the official app. */}
      <div
        className={`flex flex-col items-center gap-4 justify-self-center max-w-full py-8 ${introRise}`}
        style={rise(0)}
      >
        {/* Larger than the type scale on purpose: the one headline of the page. */}
        <h1
          id="showcase-hero"
          className="m-0 max-w-full text-center text-[length:clamp(var(--font-3xl),4.2vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
        >
          {t.rich('title', {
            name: (chunks) => (
              // The app name in the accent colour, plain text (not a logo), with a drawn dot like the header's.
              <span className="text-accent after:inline-block after:size-[0.16em] after:ml-[0.06em] after:rounded-[50%] after:bg-current">
                {chunks}
              </span>
            ),
          })}
        </h1>
        {/* 40 px above the label, on top of the gap under the headline. */}
        <p className="mt-[calc(var(--space-7)_+_var(--space-2))] mx-0 mb-0 py-1 px-3 border border-border rounded-pill text-text-muted bg-surface text-sm font-bold tracking-[0.08em] uppercase">
          {t('badge')}
        </p>
      </div>
      {/* The text and the phone start at the same height. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] [@media(max-width:72rem)]:grid-cols-[minmax(0,1fr)] items-start gap-[clamp(var(--space-7),5vw,6rem)] w-full">
        {/* The whole column next to the preview: the paragraph and the boxes take their width from it. */}
        <div className="flex flex-col items-start gap-12 justify-self-stretch min-w-0">
          {/* No width of its own (contain), so it wraps at the headline's width. */}
          <p
            className={`m-0 [contain:inline-size] self-stretch text-xl leading-body ${introRise}`}
            style={rise(1)}
          >
            {t('lead')}
          </p>
          {/* One under the other, as wide as the headline. */}
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 self-stretch m-0 p-0 list-none">
            {HIGHLIGHTS.map((highlight, index) => {
              const { id } = highlight;
              const icon = highlightIcon(highlight);
              if (!icon) {
                return null;
              }
              return (
                <li key={id} className={`${highlightClass} ${introRise}`} style={rise(2 + index)}>
                  <svg
                    className={highlightIconClass}
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                  >
                    {icon}
                  </svg>
                  <h2 className="m-0 text-xl leading-tight font-extrabold">{t(`${id}.title`)}</h2>
                  <p className="m-0 text-md leading-body text-text-muted">{t(`${id}.body`)}</p>
                </li>
              );
            })}
          </ul>{' '}
        </div>

        {/* A look at the app: the start screen, where ZUS and Tickets already are. Only a picture: it can't
            be focused or clicked, and screen readers skip it (the working phone is below). */}
        {showPreview ? (
          <div className={`${previewClass} ${introRise}`} style={rise(1)} aria-hidden="true" inert>
            <div className={previewScreenClass}>
              {/* key: a language picked in the working phone reloads this picture in that language. */}
              <iframe
                key={locale}
                className="block w-[390px] h-[calc(844px_-_var(--preview-bar))] [border:0] [transform:scale(var(--preview-scale))] origin-[0_0] pointer-events-none"
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
        className={`${ctaClass} ${introRise}`}
        style={rise(2 + HIGHLIGHTS.length)}
        href={`#${TRY_ID}`}
        onClick={(event) => {
          event.preventDefault();
          onTry();
        }}
      >
        {t('cta')}
        <svg
          className="fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
