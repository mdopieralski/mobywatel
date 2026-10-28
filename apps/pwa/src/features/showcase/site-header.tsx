import { WORKING_NAME } from '@mobywatel/brand';
import { type MouseEvent, useEffect } from 'react';
import { useTranslations } from 'use-intl';

import { AppMark } from '../../app/app-mark.tsx';
import { INTRO, introStyle, useIntroDelay } from '../../app/boot-loader.ts';
import { introReveal } from '../../app/intro.ts';
import { LanguageSwitch } from '../../app/language-switch.tsx';
import { PATHS } from '../../app/paths.ts';
import { warmCompactFontCache } from './compact-font-cache.ts';

export type HeaderLink = {
  href: string;
  label: string;
  /** "location": the section on screen (landing); "page": this page (/prototype). */
  current?: 'location' | 'page';
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

/*
 * A section link. The bar under the text grows from the centre when the link becomes current and shrinks
 * back when it stops (the motion tokens drop to 0 ms with prefers-reduced-motion). The current one gets the
 * accent colour and the bar, so it isn't colour alone. `transform`, not Tailwind's `scale-x-*` (the
 * `scale` property), so the transition on transform runs.
 */
const sectionLinkClass =
  'relative inline-flex items-center min-h-target px-4 rounded-pill text-text font-compact text-sm font-normal tracking-[0.06em] lowercase no-underline transition-[color,background-color] duration-(--duration-slow) ease-standard [&[aria-current]]:text-accent hover:bg-accent-soft hover:text-accent after:absolute after:left-4 after:right-4 after:top-[calc(50%_+_0.85em)] after:h-0.5 after:rounded-pill after:bg-current after:opacity-0 after:[transform:scaleX(0)] after:[transition:transform_var(--duration-slow)_var(--easing-standard),opacity_var(--duration-base)_var(--easing-standard)] [&[aria-current]]:after:opacity-100 [&[aria-current]]:after:[transform:scaleX(1)]';

/*
 * Our name, with a drawn dot after it (screen readers don't read it) in the accent colour. The dot is hidden
 * until the name has appeared (its reveal takes 900 ms), then blinks in like a cursor and stays on.
 * 4 × 1.2 s stays under 5 s, so no pause control is needed (WCAG 2.2.2).
 */
const brandNameClass =
  'text-xl font-extrabold tracking-[-0.01em] after:inline-block after:size-[0.22em] after:ml-[5px] after:rounded-[50%] after:bg-accent after:animate-brand-dot-blink motion-reduce:after:animate-none';

/**
 * Header of the desktop pages: our own icon and name (never official marks), then the nav and the language
 * switch. After the boot loader the tick draws, the name appears, then each link in turn (INTRO).
 * Full width, 48 px in from each side, pinned to the top while the page scrolls.
 */
export function SiteHeader({ links }: { links: readonly HeaderLink[] }) {
  const t = useTranslations('showcase');
  const nameDelay = introStyle(useIntroDelay(INTRO.nameAt));
  const navDelay = useIntroDelay(INTRO.navAt);
  useEffect(warmCompactFontCache, []);
  return (
    <header className="sticky top-0 z-1 flex flex-wrap items-center justify-between gap-4 py-4 px-12 narrow:px-4 border-b border-border bg-surface">
      <a
        className="inline-flex items-center gap-3 min-h-target text-text no-underline rounded-md"
        href={PATHS.landing}
      >
        {/* Same rounding as the icon's tile. */}
        <AppMark className="flex-none size-10 rounded-[22%]" />
        <span className={`${brandNameClass} ${introReveal}`} style={nameDelay}>
          {WORKING_NAME}
        </span>
      </a>
      {/* The section links, then the language switch. */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        {/* Pulled out by the links' padding, so the text lines up 48 px in. */}
        <nav className="flex gap-2 -mr-4 narrow:hidden" aria-label={t('nav.label')}>
          {links.map(({ href, label, current, onClick }, index) => (
            <a
              key={href}
              className={`${sectionLinkClass} ${introReveal}`}
              style={introStyle(navDelay + index * INTRO.navStepMs)}
              href={href}
              aria-current={current}
              onClick={onClick}
            >
              {label}
            </a>
          ))}
        </nav>
        {/* The page's own language switch: also changes the app in the phone (shared setting). 40 px from the
            last link's text: its 16 px padding, the nav's -16 px margin, the 16 px gap, and 24 px here. */}
        <LanguageSwitch
          className={`${introReveal} ms-6`}
          style={introStyle(navDelay + links.length * INTRO.navStepMs)}
        />
      </div>
    </header>
  );
}
