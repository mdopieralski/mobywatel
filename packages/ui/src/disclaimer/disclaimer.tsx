import { DEFAULT_LOCALE, UNOFFICIAL_DISCLAIMERS, type Locale } from '@mobywatel/brand';

export interface DisclaimerProps {
  /** `banner` on the start screen, `inline` under document views. */
  variant?: 'banner' | 'inline';
  /** UI language; the disclaimer is always shown in full in that language. */
  locale?: Locale;
}

const variants = {
  banner: 'text-text text-sm py-3 px-4 border border-border-strong rounded-md bg-surface',
  inline: 'text-text-muted text-xs',
} as const;

/** The required "unofficial prototype, fictional data" notice (prototype-guardrails skill). */
export function Disclaimer({ variant = 'banner', locale = DEFAULT_LOCALE }: DisclaimerProps) {
  return (
    <p className={`m-0 leading-body ${variants[variant]}`} data-disclaimer="">
      {UNOFFICIAL_DISCLAIMERS[locale]}
    </p>
  );
}
