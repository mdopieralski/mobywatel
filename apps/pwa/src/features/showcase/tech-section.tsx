import type { Ref } from 'react';
import { useTranslations } from 'use-intl';

import { leadClass, sectionHeadingClass } from './showcase-classes.ts';
import { TECH_ID } from './showcase-mode.ts';
import { TECH_ITEMS } from './tech-items.ts';

/**
 * Last section of the landing page: what the prototype is built with, and how we work. One list of short
 * points. Tall enough that its top reaches the header, so the nav link, #technologia and the snap all land
 * on it. Same padding as the other sections: 120 px above the heading and 120 px from the heading and lead
 * to the list.
 */
export function TechSection({ ref }: { ref?: Ref<HTMLElement> }) {
  const t = useTranslations('showcase');
  return (
    <section
      id={TECH_ID}
      ref={ref}
      tabIndex={-1}
      className="grid justify-items-center content-start gap-3 min-h-[calc(100dvh_-_var(--header-height))] py-30 px-(--section-inline) border-t border-border bg-surface text-center outline-none"
      aria-labelledby="showcase-tech"
    >
      <h2 id="showcase-tech" className={`m-0 ${sectionHeadingClass}`}>
        {t('nav.tech')}
      </h2>
      <p className={leadClass}>{t('tech.lead')}</p>
      {/* One list, no cards, one column. The width keeps lines short enough to read. */}
      <ul className="w-full mt-[calc(var(--space-9)_-_var(--space-3))] mx-0 mb-0 ps-5 text-text-muted text-md text-start">
        {TECH_ITEMS.map((item) => (
          <li key={item} className="pt-1 pb-2">
            {t(`tech.items.${item}`)}
          </li>
        ))}
      </ul>
    </section>
  );
}
