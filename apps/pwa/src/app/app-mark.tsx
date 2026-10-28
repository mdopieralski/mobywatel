import { INTRO, introStyle, useIntroDelay } from './boot-loader.ts';

/* The tick draws itself from left to right after the boot loader is gone. Once the entrance is over
   (boot-loader.ts endIntro), or with reduced motion, it is simply there. */
const tickClass =
  'fill-none stroke-logo-tick stroke-56 [stroke-linecap:round] [stroke-linejoin:round] [stroke-dasharray:1_2] [stroke-dashoffset:1] opacity-0 animate-tick-draw intro-done:[stroke-dashoffset:0] intro-done:opacity-100 intro-done:animate-none motion-reduce:[stroke-dashoffset:0] motion-reduce:opacity-100 motion-reduce:animate-none';

/**
 * Our app icon (same drawing as public/icons/favicon.svg), inline so the tick can draw itself once the
 * boot loader has faded out. Decorative: the name next to it is the link text.
 */
export function AppMark({ className, size = 40 }: { className?: string; size?: number }) {
  // Counted from this document's load, once: later route changes keep the tick drawn.
  const delay = useIntroDelay(INTRO.tickAt);
  return (
    <svg
      className={className ? `block ${className}` : 'block'}
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={introStyle(delay)}
    >
      <rect className="fill-logo-tile" width="512" height="512" rx="112" />
      <path className={tickClass} d="M146 266 L226 346 L370 184" pathLength={1} />
    </svg>
  );
}
