import { WORKING_NAME } from '@mobywatel/brand';
import { type Ref, useEffect, useState } from 'react';
import { useTranslations } from 'use-intl';

import { useAppLocale } from '../../platform/i18n.ts';
import { handOffScroll } from './scroll-handoff.ts';
import { PHONE_FRAME } from './showcase-mode.ts';

/**
 * The working app in a phone mockup: an iframe of the app, named so links can target it. Our own neutral
 * drawing, no real device art. Bezel in the ink colour (light theme), near-black with an outline in the dark
 * theme. The screen inside is a fixed 390×844 (iPhone 13–16); the bezel adds the padding.
 */
export function PhoneFrame({
  src,
  ref,
  onTitle,
}: {
  src: string;
  ref?: Ref<HTMLIFrameElement>;
  /** Called with the framed app's page title whenever it changes (screen and language). */
  onTitle?: (title: string) => void;
}) {
  const t = useTranslations('showcase');
  const [observer, setObserver] = useState<MutationObserver | null>(null);
  useEffect(() => () => observer?.disconnect(), [observer]);
  // Same origin, so the frame's <title> can be read; it is set per screen and language by the app.
  const watchTitle = (frame: HTMLIFrameElement) => {
    const doc = frame.contentDocument;
    if (!onTitle || !doc) {
      return;
    }
    observer?.disconnect();
    const next = new MutationObserver(() => onTitle(doc.title));
    next.observe(doc.head, { subtree: true, childList: true, characterData: true });
    onTitle(doc.title);
    setObserver(next);
  };
  return (
    <div className="[--device-color:var(--text)] p-3 rounded-[3.5rem] bg-(--device-color) [box-shadow:0_0_0_2px_var(--border),0_2rem_4rem_-1.5rem_color-mix(in_srgb,var(--text)_40%,transparent)] dark:[--device-color:var(--bg)] dark:[box-shadow:0_0_0_2px_var(--border-strong)]">
      <div className="flex flex-col w-[390px] h-[844px] overflow-hidden rounded-[calc(3.5rem_-_var(--space-3))] bg-bg">
        <StatusBar />
        <iframe
          ref={ref}
          name={PHONE_FRAME}
          className="flex-1 w-full min-h-0 [border:0] block"
          src={src}
          title={t('phoneLabel', { name: WORKING_NAME })}
          onLoad={(event) => {
            watchTitle(event.currentTarget);
            handOffScroll(event.currentTarget);
          }}
        />
        <div
          className="shrink-0 relative h-6 bg-surface after:absolute after:left-1/2 after:bottom-2 after:w-32 after:h-[5px] after:[transform:translateX(-50%)] after:rounded-pill after:bg-text"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function useClock(): string {
  const locale = useAppLocale();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(now);
}

/** Decorative phone status bar: hidden from screen readers. */
function StatusBar() {
  const time = useClock();
  return (
    <div
      className="relative shrink-0 flex items-center justify-between h-12 px-8 text-text text-sm font-semibold tabular-nums"
      aria-hidden="true"
    >
      <span>{time}</span>
      <span className="absolute top-3 left-1/2 w-26 h-7 [transform:translateX(-50%)] rounded-pill bg-(--device-color)" />
      <span className="flex gap-2 fill-current">
        <svg viewBox="0 0 18 12" width="18" height="12">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 26 12" width="26" height="12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" />
          <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" />
          <rect x="23.5" y="4" width="2" height="4" rx="1" />
        </svg>
      </span>
    </div>
  );
}
