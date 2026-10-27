import { DEFAULT_LOCALE, UNOFFICIAL_DISCLAIMERS, type Locale } from '@mobywatel/brand';

import styles from './disclaimer.module.css';

export interface DisclaimerProps {
  /** `banner` on the start screen, `inline` under document views. */
  variant?: 'banner' | 'inline';
  /** UI language; the disclaimer is always shown in full in that language. */
  locale?: Locale;
}

/** The required "unofficial prototype, fictional data" notice (prototype-guardrails skill). */
export function Disclaimer({ variant = 'banner', locale = DEFAULT_LOCALE }: DisclaimerProps) {
  return (
    <p className={`${styles.disclaimer} ${styles[variant]}`} data-disclaimer="">
      {UNOFFICIAL_DISCLAIMERS[locale]}
    </p>
  );
}
