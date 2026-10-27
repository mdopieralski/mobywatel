import styles from './app-mark.module.css';
import { INTRO, introStyle, useIntroDelay } from './boot-loader.ts';

/**
 * Our app icon (same drawing as public/icons/favicon.svg), inline so the tick can draw itself once the
 * boot loader has faded out. Decorative: the name next to it is the link text.
 */
export function AppMark({ className, size = 40 }: { className?: string; size?: number }) {
  // Counted from this document's load, once: later route changes keep the tick drawn.
  const delay = useIntroDelay(INTRO.tickAt);
  return (
    <svg
      className={className ? `${styles.mark} ${className}` : styles.mark}
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={introStyle(delay)}
    >
      <rect className={styles.tile} width="512" height="512" rx="112" />
      <path className={styles.tick} d="M146 266 L226 346 L370 184" pathLength={1} />
    </svg>
  );
}
