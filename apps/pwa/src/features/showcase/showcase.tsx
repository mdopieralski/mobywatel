import { TAGLINES, WORKING_NAME } from '@mobywatel/brand';
import { Disclaimer } from '@mobywatel/ui';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';

import { useAppLocale } from '../../platform/i18n.ts';
import { reloadSettings, SETTINGS_KEY } from '../../platform/settings.ts';
import { ShowcaseHero } from './showcase-hero.tsx';
import { navigatePhone, onShowcaseRoute, PHONE_FRAME, TRY_ID } from './showcase-mode.ts';
import styles from './showcase.module.css';

const CHALLENGE_URL = 'https://mobywatel.ai';
/** Id of the third section (what is new): the header's "Nowości" link scrolls there. */
const NEWS_ID = 'nowosci';
/**
 * What is new compared with the reference prototype (docs/product/reference-analysis.md §5). Only claims
 * the app already keeps, each backed by a test: offline.spec, the axe runs, the i18n test, guardrails.
 */
const NEW: { key: string; icon: ReactNode }[] = [
  // Sorted by priority (user, 2026-10-26). ZUS and tickets: the categories are on the start screen, their
  // matters are not built yet (the text says so).
  {
    key: 'zus',
    icon: <path d="M4 12a8 8 0 0 1 16 0zM12 12v6a2 2 0 0 1-4 0" />,
  },
  { key: 'tickets', icon: <path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14 7v10" /> },
  { key: 'categories', icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> },
  { key: 'senior', icon: <path d="M3 18 7.5 6 12 18M4.6 14h5.8M14 18l3.5-9 3.5 9M15 15.5h5" /> },
  {
    key: 'accessible',
    icon: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7h.01M8 10l4 1 4-1M12 11v3l-2 3.5M12 14l2 3.5" />,
  },
  {
    key: 'languages',
    icon: (
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z" />
    ),
  },
  {
    key: 'offline',
    icon: (
      <path d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 5-2.6M19 12.5a10 10 0 0 0-2.5-1.8M12 20h.01" />
    ),
  },
  { key: 'noLogin', icon: <path d="M6 11h12v9H6zM9 11V7.5a3 3 0 0 1 5.8-1.1" /> },
  { key: 'unofficial', icon: <path d="M3.5 12.5V4h8.5l8.5 8.5-8 8zM7.5 7.5h.01" /> },
];

/** Desktop page: the app in a phone frame on the left, what this is and what to try on the right. */
export function Showcase() {
  const t = useTranslations('showcase');
  const tCommon = useTranslations('common');
  const frame = useRef<HTMLIFrameElement>(null);
  const trySection = useRef<HTMLElement>(null);
  const newsSection = useRef<HTMLDivElement>(null);
  // The frame opens the URL the visitor came in on, so deep links keep working.
  const [src] = useState(() => window.location.pathname + window.location.search + window.location.hash);

  useEffect(
    () =>
      onShowcaseRoute(
        () => frame.current,
        (path) => window.history.replaceState(null, '', path)
      ),
    []
  );

  const locale = useAppLocale();

  // Bring a section into view and move focus there, so the next Tab continues from it.
  const goTo = (target: HTMLElement | null) => {
    if (!target) {
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  };
  const goToPhone = () => goTo(trySection.current);

  // The section on screen: its header link is marked as the current one. A section counts once it
  // crosses a line 40% down the window; above the first one (the hero), neither link is current.
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const sections = [trySection.current, newsSection.current].filter((el) => el !== null);
    const crossing = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            crossing.add(entry.target.id);
          } else {
            crossing.delete(entry.target.id);
          }
        }
        setCurrent(sections.find((el) => crossing.has(el.id))?.id ?? null);
      },
      { rootMargin: '-40% 0px -59% 0px' }
    );
    for (const el of sections) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const sectionLinks = [
    { id: TRY_ID, label: t('nav.prototype'), section: trySection },
    { id: NEWS_ID, label: t('nav.news'), section: newsSection },
  ];

  // Theme, senior mode or language changed inside the phone: follow it on this page too.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) {
        reloadSettings();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className={styles.page}>
      {/* Our own icon and name, never official marks (prototype-guardrails skill). */}
      <a className={styles.skip} href="#main">
        {tCommon('skipToContent')}
      </a>
      <header className={styles.header}>
        <a className={styles.home} href="/">
          <img className={styles.logo} src="/icons/favicon.svg" alt="" width={40} height={40} />
          <span className={styles.brandName}>{WORKING_NAME}</span>
        </a>
        <nav className={styles.sectionNav} aria-label={t('nav.label')}>
          {sectionLinks.map(({ id, label, section }) => (
            <a
              key={id}
              className={styles.sectionLink}
              href={`#${id}`}
              aria-current={current === id ? 'location' : undefined}
              onClick={(event) => {
                event.preventDefault();
                goTo(section.current);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        <ShowcaseHero
          onTry={goToPhone}
          openInPhone={(path) => {
            const moved = navigatePhone(frame.current, path);
            if (moved) {
              goToPhone();
            }
            return moved;
          }}
        />
        {/* Second section: only the working prototype. Its heading is for screen readers (people moving by
            headings land here); on screen the phone speaks for itself. */}
        <section
          id={TRY_ID}
          ref={trySection}
          tabIndex={-1}
          className={styles.prototype}
          aria-labelledby="showcase-prototype"
        >
          <h2 id="showcase-prototype" className={styles.visuallyHidden}>
            {t('nav.prototype')}
          </h2>
          <div className={styles.device}>
            <div className={styles.screen}>
              <StatusBar />
              <iframe
                ref={frame}
                name={PHONE_FRAME}
                className={styles.app}
                src={src}
                title={t('phoneLabel', { name: WORKING_NAME })}
              />
              <div className={styles.homeBar} aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Third section: what this is and what is new. */}
        <div id={NEWS_ID} ref={newsSection} tabIndex={-1} className={styles.panel}>
          <div className={styles.intro}>
            <h2 className={styles.title}>{TAGLINES[locale]}</h2>
            <p className={styles.lead}>{t('lead')}</p>
          </div>

          <section className={styles.news} aria-labelledby="showcase-new">
            <h2 id="showcase-new" className={styles.eyebrow}>
              {t('newTitle')}
            </h2>
            <ul className={styles.features}>
              {NEW.map(({ key, icon }) => (
                <li key={key} className={styles.feature}>
                  <svg
                    className={styles.featureIcon}
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    {icon}
                  </svg>
                  <div className={styles.featureText}>
                    <h3 className={styles.featureTitle}>{t(`new.${key}.title`)}</h3>
                    <p>{t(`new.${key}.body`)}</p>
                    <p className={styles.featureTry}>
                      <strong>{t('tryLabel')}</strong> {t(`new.${key}.try`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.challenge} aria-labelledby="showcase-challenge">
            <p className={styles.challengeEyebrow}>{t('challenge.eyebrow')}</p>
            <h2 id="showcase-challenge" className={styles.challengeTitle}>
              {t('challenge.title')}
            </h2>
            <p>{t('challenge.body')}</p>
            <a className={styles.challengeLink} href={CHALLENGE_URL}>
              {t('challenge.link')}
            </a>
          </section>

          <div className={styles.wide}>
            <Disclaimer variant="inline" locale={locale} />
          </div>
        </div>
      </main>
    </div>
  );
}

function useClock(): string {
  const locale = useAppLocale();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(now);
}

/** Decorative phone status bar: hidden from screen readers. */
function StatusBar() {
  const time = useClock();
  return (
    <div className={styles.statusBar} aria-hidden="true">
      <span>{time}</span>
      <span className={styles.island} />
      <span className={styles.icons}>
        <svg viewBox="0 0 18 12" width="18" height="12">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 26 12" width="26" height="12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" />
          <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" />
          <rect x="23.5" y="4" width="2" height="4" rx="1" />
        </svg>
      </span>
    </div>
  );
}
