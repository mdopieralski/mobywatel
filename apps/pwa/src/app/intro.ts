/*
 * Header entrance after the boot loader (INTRO in boot-loader.ts). The element stays in the page and in the
 * accessibility tree; only its look waits for --intro-delay (keyframes in global.css).
 *
 * Shown at once when the entrance is over for good (first key press or click, or inside a phone frame:
 * endIntro sets data-intro-done), when something got focus before its turn (so focus is never on something
 * invisible), and with reduced motion.
 */
const done =
  'intro-done:opacity-100 intro-done:animate-none focus-visible:opacity-100 focus-visible:animate-none motion-reduce:opacity-100 motion-reduce:animate-none';

/** Small items (name, shortcuts) slide in from the left. */
export const introReveal = `opacity-0 animate-intro-reveal ${done}`;

/** Bigger blocks (the showcase hero) rise in from below. */
export const introRise = `opacity-0 animate-intro-rise ${done} focus-within:opacity-100 focus-within:animate-none`;
