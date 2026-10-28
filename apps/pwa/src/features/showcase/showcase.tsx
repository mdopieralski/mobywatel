import { TAGLINES, WORKING_NAME } from '@mobywatel/brand';
import { Disclaimer } from '@mobywatel/ui';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import { useAppLocale } from '../../platform/i18n.ts';
import { useFollowPhoneSettings } from './follow-phone-settings.ts';
import { useSectionSnap } from './section-snap.ts';
import { PhoneFrame } from './phone-frame.tsx';
import { ShowcaseHero } from './showcase-hero.tsx';
import { HERO_ID, NEWS_ID, TECH_ID, TRY_ID } from './showcase-mode.ts';
import { SiteHeader } from './site-header.tsx';
import { TechSection } from './tech-section.tsx';
import './compact-font.css';
import styles from './showcase.module.css';

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

/**
 * Desktop landing page ("/"): the hero, the working app in a phone mockup, then what is new. The phone
 * opens /prototype; this page's address stays "/" (the app's own page with an address per screen is
 * /prototype, see prototype-page.tsx).
 */
export function Showcase() {
  const t = useTranslations('showcase');
  const tCommon = useTranslations('common');
  const frame = useRef<HTMLIFrameElement>(null);
  const heroSection = useRef<HTMLElement>(null);
  const trySection = useRef<HTMLElement>(null);
  const newsSection = useRef<HTMLDivElement>(null);
  const techSection = useRef<HTMLElement>(null);
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
  // crosses a line 40% down the window.
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const sections = [
      heroSection.current,
      trySection.current,
      newsSection.current,
      techSection.current,
    ].filter((el) => el !== null);
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

  // Arriving with #nowosci, #technologia or #section-hero (the links on /prototype): the page renders after load, so scroll here.
  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if ([heroSection, trySection, newsSection, techSection].some((section) => section.current === target)) {
      target?.scrollIntoView({ block: 'start' });
    }
  }, []);

  useFollowPhoneSettings();

  // Scrolling settles on the nearest section (GSAP ScrollTrigger snap).
  const main = useRef<HTMLElement>(null);
  useSectionSnap(main, () => document.querySelector('header'));

  const sectionLinks = [
    { id: HERO_ID, label: t('nav.start') },
    { id: TRY_ID, label: t('nav.prototype') },
    { id: NEWS_ID, label: t('nav.news') },
    { id: TECH_ID, label: t('nav.tech') },
  ];

  return (
    <div className={styles.page}>
      {/* Our own icon and name, never official marks (prototype-guardrails skill). */}
      <a className={styles.skip} href="#main">
        {tCommon('skipToContent')}
      </a>
      <SiteHeader
        links={sectionLinks.map(({ id, label }) => ({
          href: `#${id}`,
          label,
          current: current === id ? 'location' : undefined,
          onClick: (event) => {
            event.preventDefault();
            goTo(document.getElementById(id));
          },
        }))}
      />
      <main id="main" ref={main} tabIndex={-1} className={styles.main}>
        <ShowcaseHero ref={heroSection} onTry={goToPhone} />
        {/* Second section: the working prototype under its heading. */}
        <section
          id={TRY_ID}
          ref={trySection}
          tabIndex={-1}
          className={`${styles.prototype} ${styles.drawingGrid}`}
          aria-labelledby="showcase-prototype"
        >
          <h2 id="showcase-prototype" className={`${styles.title} ${styles.sectionHeading}`}>
            {t('nav.prototype')}
          </h2>
          <PhoneFrame ref={frame} src={PATHS.start} />
        </section>

        {/* What this is and what is new. */}
        <div id={NEWS_ID} ref={newsSection} tabIndex={-1} className={styles.panel}>
          {/* Our name as the section heading, like "Prototyp" above. A name, so the same in every language. */}
          <h2 className={`${styles.title} ${styles.sectionHeading} ${styles.panelHeading}`}>
            {WORKING_NAME}
          </h2>
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
        </div>

        {/* Fourth section: how it is built. */}
        <TechSection ref={techSection} />
      </main>
      {/* Footer: the unofficial-prototype notice (prototype-guardrails skill). */}
      <footer className={styles.footer}>
        <Disclaimer variant="inline" locale={locale} />
      </footer>
    </div>
  );
}
