import type { MouseEvent, ReactNode, Ref } from 'react';
import { useTranslations } from 'use-intl';

import { AUDIENCE, type AudienceId } from './audience.ts';
import { AUDIENCE_ID, PHONE_FRAME } from './showcase-mode.ts';

/**
 * Avatars: our own line drawings on a 48 px grid, one prop each that hints at the need. No faces that could
 * pass for a real person, no flags, no official marks. Decorative: the name and text carry the meaning.
 */
const AVATARS: Record<AudienceId, { hue: string; art: ReactNode }> = {
  // Teresa: grey hair, reading glasses, a phone with large blocks.
  senior: {
    hue: 'plum',
    art: (
      <>
        <path d="M15 19c0-6 4-10 9-10s9 4 9 10c-2-2-5-3-9-3s-7 1-9 3z" />
        <circle cx="24" cy="20" r="7" />
        <path d="M18.5 20h4M25.5 20h4M22.5 20a1.5 1.5 0 0 0 3 0" />
        <path d="M12 41c1-7 6-11 12-11s11 4 12 11" />
        <rect x="29" y="31" width="9" height="13" rx="1.5" />
        <path d="M31 34h5M31 37.5h5" />
      </>
    ),
  },
  // Marek: over-ear headphones, a keyboard.
  screenReader: {
    hue: 'indigo',
    art: (
      <>
        <circle cx="24" cy="18" r="7" />
        <path d="M15 19a9 9 0 0 1 18 0" />
        <rect x="13" y="17" width="3.5" height="6" rx="1.5" />
        <rect x="31.5" y="17" width="3.5" height="6" rx="1.5" />
        <path d="M13 36c1.5-5 6-8 11-8s9.5 3 11 8" />
        <rect x="10" y="36" width="28" height="7" rx="1.5" />
        <path d="M14 39.5h2M19 39.5h2M24 39.5h2M29 39.5h5" />
      </>
    ),
  },
  // Oksana: a speech bubble with two alphabets.
  languages: {
    hue: 'teal',
    art: (
      <>
        <circle cx="18" cy="21" r="6.5" />
        <path d="M8 41c1-6.5 4.5-10 10-10s9 3.5 10 10" />
        <path d="M26 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4 3.5V20h-2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
        <path d="M29.5 17l2-6 2 6M30 15.5h3M36 11h3l-1.5 2.5a1.6 1.6 0 1 1-1.5 2.5V11" />
      </>
    ),
  },
  // Krzysztof: a fence and a field, a phone with one signal bar and a saved tick.
  offline: {
    hue: 'olive',
    art: (
      <>
        <circle cx="20" cy="18" r="6.5" />
        <path d="M10 38c1-6.5 4.5-10 10-10s9 3.5 10 10" />
        <path d="M6 42h36M33 42V31M38 42V31M31 34h9M31 38.5h9" />
        <rect x="28" y="9" width="9" height="15" rx="1.5" />
        <path d="M30 21v-1.5M30.5 15.5l1.5 1.5 3-3" />
      </>
    ),
  },
  // Ewa: a cup at the table, a circular "start again" arrow.
  noLogin: {
    hue: 'brown',
    art: (
      <>
        <circle cx="21" cy="17" r="6.5" />
        <path d="M11 37c1-6.5 4.5-10 10-10s9 3.5 10 10" />
        <path d="M6 37h36" />
        <path d="M33 30h6v4a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3zM39 31.5h1.5a1.5 1.5 0 0 1 0 3H39" />
        <path d="M41 13a6 6 0 1 1-2-4.5M39 5v4h-4" />
      </>
    ),
  },
  // Kuba: a backpack at a generic tram stop.
  cityTicket: {
    hue: 'blue',
    art: (
      <>
        <circle cx="17" cy="17" r="6.5" />
        <path d="M7 41c1-7 4.5-11 10-11s9 4 10 11" />
        <path d="M23 30h4a2 2 0 0 1 2 2v7h-6" />
        <path d="M37 42V10M33 10h8v6h-8z" />
        <path d="M30 22h12" />
      </>
    ),
  },
  // Zbigniew: a calendar page with one day ticked.
  zusVisit: {
    hue: 'green',
    art: (
      <>
        <circle cx="17" cy="17" r="6.5" />
        <path d="M7 41c1-7 4.5-11 10-11s9 4 10 11" />
        <rect x="28" y="10" width="14" height="14" rx="1.5" />
        <path d="M28 15h14M32 8v4M38 8v4M32 19.5l2 2 3.5-3.5" />
      </>
    ),
  },
};

// About one window tall so the section snap stays calm; 120 px above the heading and from it to the cards,
// like the other sections. --section-inline and --header-height come from the landing page.
const audienceClass =
  'grid justify-items-center content-start gap-6 min-h-[calc(100dvh_-_var(--header-height))] py-(--section-block) px-(--section-inline) border-t border-border outline-none';

/**
 * "Dla kogo": seven fictional example people and the improvement that already works for each (plan:
 * docs/product/who-it-helps.md). `onShow` opens a screen in the phone and brings the phone into view.
 */
export function WhoItHelps({
  ref,
  onShow,
}: {
  ref?: Ref<HTMLElement>;
  /** Opens `path` in the phone. False when the phone isn't there: the link then opens it the usual way. */
  onShow: (path: string) => boolean;
}) {
  const t = useTranslations('showcase');
  const tSoon = useTranslations('soon');

  const show = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (onShow(path)) {
      event.preventDefault();
    }
  };

  return (
    <section
      id={AUDIENCE_ID}
      ref={ref}
      tabIndex={-1}
      className={audienceClass}
      aria-labelledby="showcase-audience"
    >
      <div className="grid gap-3 max-w-[64rem] mb-[calc(var(--section-block)_-_var(--space-6))] text-center">
        <h2
          id="showcase-audience"
          className="m-0 text-accent text-[length:calc(2*var(--font-3xl))] leading-tight font-extrabold tracking-[-0.02em]"
        >
          {t('audience.title')}
        </h2>
        <p className="m-0 text-text-muted text-lg">{t('audience.lead')}</p>
      </div>
      <ul className="w-full grid grid-cols-3 gap-10 m-0 p-0 list-none [@media(52rem<width<=80rem)]:grid-cols-2 [@media(max-width:52rem)]:grid-cols-1">
        {AUDIENCE.map(({ id, to, soon }) => (
          <li
            key={id}
            className="flex flex-col gap-4 py-8 px-5 border border-border rounded-lg bg-surface [&_p]:m-0"
          >
            <div className="flex items-center gap-4">
              <svg
                className="flex-none rounded-[50%] text-card-text fill-none stroke-current stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]"
                style={{ background: `var(--card-${AVATARS[id].hue})` }}
                aria-hidden="true"
                viewBox="0 0 48 48"
                width="64"
                height="64"
              >
                {AVATARS[id].art}
              </svg>
              <div>
                <h3 className="m-0 text-xl leading-tight">{t(`audience.people.${id}.name`)}</h3>
                <p className="text-text-muted text-sm">{t(`audience.people.${id}.meta`)}</p>
              </div>
              {soon ? (
                <p className="ms-auto self-start py-1 px-3 rounded-pill bg-accent-soft text-accent text-sm font-semibold">
                  {tSoon('badge')}
                </p>
              ) : null}
            </div>
            <p className="italic before:content-['„'] after:content-['”']">
              {t(`audience.people.${id}.need`)}
            </p>
            <p>{t(`audience.people.${id}.helps`)}</p>
            <p className="text-text-muted text-sm">
              <strong>{t('audience.tryLabel')}</strong> {t(`audience.people.${id}.try`)}
            </p>
            {to ? (
              <a
                className="mt-auto self-start inline-flex items-center min-h-target px-4 border-2 border-accent rounded-pill text-accent font-bold no-underline hover:bg-accent-soft focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-focus focus-visible:outline-offset-2"
                href={to}
                target={PHONE_FRAME}
                onClick={show(to)}
              >
                {t(`audience.people.${id}.open`)}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="m-0 max-w-[48rem] text-text-muted text-sm text-center">{t('audience.fictionNote')}</p>
    </section>
  );
}
