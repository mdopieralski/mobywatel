import type { Ref } from 'react';
import { useTranslations } from 'use-intl';

import { TECH_ID } from './showcase-mode.ts';
import { TECH_ITEMS } from './tech-items.ts';
import styles from './showcase.module.css';

/** Last section of the landing page: what the prototype is built with, and how we work. */
export function TechSection({ ref }: { ref?: Ref<HTMLElement> }) {
  const t = useTranslations('showcase');
  return (
    <section id={TECH_ID} ref={ref} tabIndex={-1} className={styles.tech} aria-labelledby="showcase-tech">
      <h2 id="showcase-tech" className={`${styles.title} ${styles.sectionHeading}`}>
        {t('nav.tech')}
      </h2>
      <p className={styles.lead}>{t('tech.lead')}</p>
      <ul className={styles.techList}>
        {TECH_ITEMS.map((item) => (
          <li key={item}>{t(`tech.items.${item}`)}</li>
        ))}
      </ul>
    </section>
  );
}
