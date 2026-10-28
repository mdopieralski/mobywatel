import { DEMO_CHAPTERS, DEMO_CUES, type DemoChapterId } from '@mobywatel/content/demo-video';
import { type MouseEvent, type Ref, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';

import { useAppLocale } from '../../platform/i18n.ts';
import { DEMO_TRY, DEMO_VIDEO } from './demo.ts';
import { leadClass, sectionHeadingClass } from './showcase-classes.ts';
import { DEMO_ID, PHONE_FRAME } from './showcase-mode.ts';

/**
 * The player asks for byte ranges, and a partial answer can't be stored. So on the first play the whole file
 * is fetched once into the cache the service worker reads (vite.config.ts, "demo-video"); from then on it
 * plays and seeks offline. No-op where Cache Storage is missing (http, private modes).
 */
function keepForOffline() {
  if (!('caches' in window)) {
    return;
  }
  void caches
    .open('demo-video')
    .then(async (cache) => {
      if (!(await cache.match(DEMO_VIDEO.src))) {
        await cache.add(DEMO_VIDEO.src);
      }
    })
    .catch(() => undefined);
}

const FIRST = DEMO_CHAPTERS[0]?.from ?? 0;
const LAST = DEMO_CHAPTERS.at(-1)?.to ?? 0;

// Title on top; then the chapter buttons on the left, the video on the right; stacked in a narrower window. Same padding as
// the other sections (--section-inline comes from the page; 48 px if it isn't there).
const demoClass =
  'grid grid-cols-[minmax(20rem,1fr)_minmax(0,2fr)] items-center content-start gap-x-[clamp(var(--space-7),4vw,var(--space-8))] gap-y-6 min-h-[calc(100dvh_-_var(--header-height))] py-30 px-[var(--section-inline,var(--space-8))] border-t border-border outline-none [@media(max-width:72rem)]:grid-cols-1';

// Pressed = the chapter on screen, shown by the fill and a bar, not by colour alone.
const chapterClass =
  'grid justify-items-start min-h-target py-2 px-4 border-2 border-border rounded-lg bg-surface text-text [font-family:inherit] [font-size:inherit] [line-height:inherit] font-bold text-start cursor-pointer hover:border-accent aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent aria-pressed:[box-shadow:inset_0_-4px_0_var(--accent)] focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-focus focus-visible:outline-offset-2';

// Captions (::cue): a solid plate for contrast over any frame (a pair checked in CONTRAST_PAIRS), a little
// larger than the browser default.
const videoClass =
  'block w-full h-auto aspect-video rounded-lg border border-border bg-surface [&::cue]:bg-card-slate [&::cue]:text-card-text [&::cue]:text-[1.15em] [&::cue]:leading-[1.35]';

const transcriptClass =
  '[&_summary]:min-h-target [&_summary]:flex [&_summary]:items-center [&_summary]:font-bold [&_summary]:cursor-pointer [&_summary]:focus-visible:outline-3 [&_summary]:focus-visible:outline-solid [&_summary]:focus-visible:outline-focus [&_summary]:focus-visible:outline-offset-2 [&_h3]:mt-4 [&_h3]:mx-0 [&_h3]:mb-1 [&_h3]:text-md [&_:is(p,ul)]:mt-0 [&_:is(p,ul)]:mx-0 [&_:is(p,ul)]:mb-2 [&_:is(p,ul)]:text-text-muted';

/**
 * "Demo": the silent 80-second video "Jeden dzień z aplikacją" (docs/product/demo-video.md). Chapter buttons
 * jump to each proposal, captions follow the page language (built here from the same timeline the video
 * uses), and the text version below describes every scene. It never plays on its own.
 */
export function DemoSection({
  ref,
  onShow,
}: {
  ref?: Ref<HTMLElement>;
  /** Opens `path` in the phone. False when the phone isn't there: the link then opens it the usual way. */
  onShow: (path: string) => boolean;
}) {
  const t = useTranslations('showcase');
  const locale = useAppLocale();
  const video = useRef<HTMLVideoElement>(null);
  const [chapter, setChapter] = useState<DemoChapterId | null>(null);
  const [failed, setFailed] = useState(false);

  // Captions in the page language, as a text track: the browser draws them, also in fullscreen, and they
  // follow the user's caption settings. A track can't be removed, so each language gets one, made once.
  const tracks = useRef(new Map<string, TextTrack>());
  useEffect(() => {
    const el = video.current;
    if (!el || typeof el.addTextTrack !== 'function' || typeof VTTCue === 'undefined') {
      return;
    }
    let track = tracks.current.get(locale);
    if (!track) {
      track = el.addTextTrack('captions', t('demo.captions'), locale);
      for (const cue of DEMO_CUES) {
        const vtt = new VTTCue(cue.from, cue.to, t(`demo.cues.${cue.key}`));
        // Bottom left, under the chapter name: the phone fills the right half of the frame.
        vtt.line = -2;
        vtt.position = 8;
        vtt.positionAlign = 'line-left';
        vtt.size = 52;
        vtt.align = 'start';
        track.addCue(vtt);
      }
      tracks.current.set(locale, track);
    }
    for (const [lang, other] of tracks.current) {
      other.mode = lang === locale ? 'showing' : 'disabled';
    }
  }, [locale, t]);

  const onTime = () => {
    const now = video.current?.currentTime ?? 0;
    setChapter(DEMO_CHAPTERS.find((c) => now >= c.from && now < c.to)?.id ?? null);
  };

  // After a failed load (offline), try again once the connection is back or when asked to play.
  const retry = () => {
    const el = video.current;
    if (el?.error) {
      setFailed(false);
      el.load();
    }
  };
  useEffect(() => {
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);

  const jump = (id: DemoChapterId) => {
    const el = video.current;
    const from = DEMO_CHAPTERS.find((c) => c.id === id)?.from ?? 0;
    setChapter(id);
    if (el) {
      retry();
      el.currentTime = from;
      // Asked for by a click, so playing is expected. A browser may still refuse; the controls stay.
      el.play().catch(() => undefined);
    }
  };

  const shown = chapter ?? 'zus';
  const tryIt = (event: MouseEvent<HTMLAnchorElement>) => {
    video.current?.pause();
    if (onShow(DEMO_TRY[shown])) {
      event.preventDefault();
    }
  };

  return (
    <section id={DEMO_ID} ref={ref} tabIndex={-1} className={demoClass} aria-labelledby="showcase-demo">
      {/* Title and lead like every other section: centred over the whole width, 120 px above the content
          (24 px row gap + the margin). */}
      <div className="col-span-full justify-self-center grid gap-3 max-w-[64rem] mb-[calc(var(--space-9)_-_var(--space-6))] text-center">
        <h2 id="showcase-demo" className={`m-0 ${sectionHeadingClass}`}>
          {t('demo.title')}
        </h2>
        <p className={leadClass}>{t('demo.lead')}</p>
      </div>

      <div className="grid gap-5 [&_p]:m-0">
        <div className="grid grid-cols-1 gap-3" role="group" aria-label={t('demo.chaptersLabel')}>
          {DEMO_CHAPTERS.map(({ id }, i) => (
            <button
              key={id}
              type="button"
              className={chapterClass}
              aria-pressed={chapter === id}
              onClick={() => jump(id)}
            >
              <span className="text-text-muted text-sm font-semibold">
                {i + 1}. {t(`demo.chapters.${id}.time`)}
              </span>
              {t(`demo.chapters.${id}.name`)}
            </button>
          ))}
        </div>

        <div className="grid justify-items-start gap-3 py-4 px-5 rounded-lg bg-surface border border-border">
          <p>{t(`demo.chapters.${shown}.body`)}</p>
          <a
            className="inline-flex items-center min-h-target px-4 border-2 border-accent rounded-pill text-accent font-bold no-underline hover:bg-accent-soft focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-focus focus-visible:outline-offset-2"
            href={DEMO_TRY[shown]}
            target={PHONE_FRAME}
            onClick={tryIt}
          >
            {t(`demo.chapters.${shown}.try`)}
          </a>
        </div>
        <p className="text-text-muted text-sm">{t('demo.proposalNote')}</p>
      </div>

      <div className="grid gap-3 min-w-0">
        {/* Silent (no audio track), so `muted` changes nothing but lets phones play it inline. */}
        <video
          ref={video}
          className={videoClass}
          src={DEMO_VIDEO.src}
          poster={DEMO_VIDEO.poster}
          aria-label={t('demo.videoLabel')}
          controls
          muted
          playsInline
          preload="none"
          width={1920}
          height={1080}
          onTimeUpdate={onTime}
          onPlay={keepForOffline}
          onError={() => setFailed(true)}
        />
        {/* Always in the page, so a screen reader announces the message when it appears. */}
        <p className="m-0 text-text-muted" role="status">
          {failed ? t('demo.offline') : null}
        </p>

        <details className={transcriptClass}>
          <summary>{t('demo.transcript')}</summary>
          <p>{t('demo.intro')}</p>
          <ul>
            {DEMO_CUES.filter((c) => c.to <= FIRST).map((c) => (
              <li key={c.key}>{t(`demo.cues.${c.key}`)}</li>
            ))}
          </ul>
          {DEMO_CHAPTERS.map(({ id, from, to }) => (
            <section key={id} aria-label={t(`demo.chapters.${id}.name`)}>
              <h3>{t(`demo.chapters.${id}.name`)}</h3>
              <p>{t(`demo.chapters.${id}.scene`)}</p>
              <ul>
                {DEMO_CUES.filter((c) => c.from >= from && c.from < to).map((c) => (
                  <li key={c.key}>{t(`demo.cues.${c.key}`)}</li>
                ))}
              </ul>
            </section>
          ))}
          <p>{t('demo.outro')}</p>
          <ul>
            {DEMO_CUES.filter((c) => c.from >= LAST).map((c) => (
              <li key={c.key}>{t(`demo.cues.${c.key}`)}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
