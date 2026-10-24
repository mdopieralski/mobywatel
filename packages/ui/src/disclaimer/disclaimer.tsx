import { UNOFFICIAL_DISCLAIMER } from '@mobywatel/brand';

import styles from './disclaimer.module.css';

export interface DisclaimerProps {
  /** `banner` on the start screen, `inline` under document views. */
  variant?: 'banner' | 'inline';
}

/** The required "unofficial prototype, fictional data" notice (prototype-guardrails skill). */
export function Disclaimer({ variant = 'banner' }: DisclaimerProps) {
  return (
    <p className={`${styles.disclaimer} ${styles[variant]}`} data-disclaimer="">
      {UNOFFICIAL_DISCLAIMER}
    </p>
  );
}
