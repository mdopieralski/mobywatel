import { LOCALE_NAMES, LOCALES, type Locale } from '@mobywatel/brand';
import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'use-intl';

import { useAppLocale } from '../platform/i18n.ts';
import { updateSettings } from '../platform/settings.ts';
import { visuallyHidden } from './visually-hidden.ts';

/* Looks like the globe in the phone's header. The current language and the open list: accent colour plus a
   tint, so it isn't colour alone. */
const buttonClass = {
  page:
    'inline-flex items-center justify-center gap-1 min-w-target min-h-target py-0 px-3 border border-border rounded-pill bg-surface text-text ' +
    'font-compact text-sm font-semibold leading-[inherit] tracking-[0.06em] cursor-pointer ' +
    'hover:bg-accent-soft hover:text-accent aria-expanded:bg-accent-soft aria-expanded:text-accent',
  // Inside the app: the compact globe of the app header, no outline, like the shortcuts next to it.
  app:
    'inline-flex items-center justify-center gap-[2px] min-w-target min-h-target py-0 px-1 border-0 rounded-md bg-transparent text-text ' +
    '[font-family:inherit] [font-size:inherit] font-semibold leading-[inherit] tracking-normal cursor-pointer ' +
    'hover:text-accent aria-expanded:bg-accent-soft aria-expanded:text-accent',
} as const;

const iconClass =
  '[&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.75] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]';

const listClass = {
  page: 'min-w-[14rem]',
  // In the phone (320 px, senior text) the list may be wider than the space left of the button: keep it on
  // screen.
  app: 'min-w-[min(14rem,calc(100vw_-_2_*_var(--space-4)))] max-w-[calc(100vw_-_2_*_var(--space-4))]',
} as const;

/**
 * Language switch for the app header and the desktop page header: a globe with the current code. It opens a
 * list of the 8 languages, each named in its own language, visible in every language so it is findable
 * without reading the UI. The setting is shared between the page and the app in its phone frame (same
 * storage, see watchSettingsFromOtherDocuments), so both change together.
 *
 * Keyboard: Enter or Space opens the list on the current language; arrows, Home and End move; the first
 * letter of a language code (p e u d c s l b) jumps to it; Enter picks; Escape closes and returns to the
 * button. So "Ukrainian" is Enter, U, Enter from the button.
 */
export function LanguageSwitch({
  variant = 'page',
  className,
  style,
}: {
  /** "app": the compact look of the app's header; "page": a pill in the desktop page header. */
  variant?: 'app' | 'page';
  className?: string;
  style?: CSSProperties;
}) {
  const t = useTranslations('common');
  const locale = useAppLocale();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const items = useRef(new Map<Locale, HTMLButtonElement>());

  // The list hangs from the button's right edge. Where that would cross the window's edge (a narrow phone,
  // senior text, a wrapped header), shift it back on screen. On a short window (a phone on its side) it
  // scrolls inside itself, so every language stays reachable by touch.
  useLayoutEffect(() => {
    const el = list.current;
    if (!open || !el) {
      return;
    }
    el.style.transform = '';
    el.style.maxHeight = '';
    el.style.overflowY = '';
    const margin = 8;
    const { left, right, top } = el.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    const shift = left < margin ? margin - left : right > width - margin ? width - margin - right : 0;
    if (shift) {
      el.style.transform = `translateX(${Math.round(shift)}px)`;
    }
    // At least three rows, even when the button sits near the bottom of a tiny window.
    const room = Math.max(window.innerHeight - top - margin, 160);
    if (el.scrollHeight > room) {
      el.style.maxHeight = `${Math.round(room)}px`;
      el.style.overflowY = 'auto';
    }
  }, [open]);

  // Opening moves focus to the current language.
  useEffect(() => {
    if (open) {
      items.current.get(locale)?.focus();
    }
  }, [open, locale]);

  // A click outside closes the list without moving focus.
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  const pick = (next: Locale) => {
    updateSettings({ locale: next });
    close();
  };

  const onListKey = (event: KeyboardEvent<HTMLUListElement>) => {
    const focused = LOCALES.findIndex((l) => items.current.get(l) === document.activeElement);
    const move = (index: number) => {
      event.preventDefault();
      const next = LOCALES[(index + LOCALES.length) % LOCALES.length];
      if (next) {
        items.current.get(next)?.focus();
      }
    };
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      move(focused + 1);
    } else if (event.key === 'ArrowUp') {
      move(focused - 1);
    } else if (event.key === 'Home') {
      move(0);
    } else if (event.key === 'End') {
      move(LOCALES.length - 1);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const index = LOCALES.findIndex((l) => l.startsWith(event.key.toLowerCase()));
      if (index >= 0) {
        move(index);
      }
    }
  };

  return (
    <div
      ref={root}
      // Inside the app: 40 px of space from the shortcuts before it.
      className={`relative ${variant === 'app' ? 'ms-[calc(var(--space-7)_+_var(--space-2))]' : ''} ${className ?? ''}`}
      style={style}
      onBlur={(event) => {
        // Tabbing out of the open list closes it. Only when focus lands somewhere: Safari doesn't focus a
        // clicked button, so a click on a language blurs with no target and must still reach its button
        // (clicks outside are handled by the pointerdown listener).
        const next = event.relatedTarget as Node | null;
        if (open && next && !root.current?.contains(next)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={button}
        type="button"
        className={`${buttonClass[variant]} ${iconClass}`}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((was) => !was)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        <span>{locale.toUpperCase()}</span>
        <span className={visuallyHidden}> – {t('changeLanguage')}</span>
      </button>
      <ul
        ref={list}
        id={listId}
        className={`absolute top-[calc(100%_+_var(--space-2))] right-0 z-2 m-0 p-2 list-none border border-border rounded-md bg-surface-raised [box-shadow:0_8px_24px_color-mix(in_srgb,var(--text)_16%,transparent)] [&[hidden]]:hidden ${listClass[variant]}`}
        hidden={!open}
        onKeyDown={onListKey}
      >
        {LOCALES.map((l) => (
          <li key={l}>
            <button
              ref={(el) => {
                if (el) {
                  items.current.set(l, el);
                } else {
                  items.current.delete(l);
                }
              }}
              type="button"
              className={`flex items-center gap-3 w-full min-h-target py-0 px-3 border-0 rounded-sm text-md leading-[inherit] text-start cursor-pointer ${
                l === locale
                  ? 'bg-accent-soft text-accent font-semibold'
                  : 'bg-transparent text-text [font-weight:inherit] hover:bg-accent-soft'
              } [font-family:inherit] [font-style:inherit]`}
              lang={l}
              aria-current={l === locale ? 'true' : undefined}
              onClick={() => pick(l)}
            >
              <span
                className={`min-w-[2ch] font-compact text-sm tracking-[0.06em] ${l === locale ? '' : 'text-text-muted'}`}
                aria-hidden="true"
              >
                {l.toUpperCase()}
              </span>
              {LOCALE_NAMES[l]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
