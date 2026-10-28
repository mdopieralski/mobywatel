import { ZUS_OFFICES, type ZusOffice } from '@mobywatel/content';
import type { Ref } from 'react';
import { useTranslations } from 'use-intl';

import {
  optionClass,
  optionListClass,
  optionMetaClass,
  optionNameClass,
  panelTitleClass,
} from '../travel/picker-classes.ts';
import { hintClass, zusPanelClass } from './zus-classes.ts';

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
    <section className={zusPanelClass} aria-labelledby="zus-offices">
      <h2 id="zus-offices" ref={headingRef} tabIndex={-1} className={panelTitleClass}>
        {t('title')}
      </h2>
      <p className={hintClass}>{t('hint')}</p>
      <ul className={optionListClass}>
        {ZUS_OFFICES.map((office) => (
          <li key={office.id}>
            <button type="button" className={optionClass} onClick={() => onChoose(office)}>
              <span className={optionNameClass}>{t('name', { name: office.name })}</span>
              <span className={optionMetaClass}>{office.city}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
