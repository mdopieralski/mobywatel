import { ZUS_OFFICES, type ZusOffice } from '@mobywatel/content';
import type { Ref } from 'react';
import { useTranslations } from 'use-intl';

import styles from './zus.module.css';

/** Step 1: the invented offices, as big buttons. */
export function OfficeList({
  onChoose,
  headingRef,
}: {
  onChoose: (office: ZusOffice) => void;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  const t = useTranslations('zus.offices');
  return (
    <section className={styles.panel} aria-labelledby="zus-offices">
      <h2 id="zus-offices" ref={headingRef} tabIndex={-1} className={styles.title}>
        {t('title')}
      </h2>
      <p className={styles.hint}>{t('hint')}</p>
      <ul className={styles.list}>
        {ZUS_OFFICES.map((office) => (
          <li key={office.id}>
            <button type="button" className={styles.option} onClick={() => onChoose(office)}>
              <span className={styles.optionName}>{t('name', { name: office.name })}</span>
              <span className={styles.optionMeta}>{office.city}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
