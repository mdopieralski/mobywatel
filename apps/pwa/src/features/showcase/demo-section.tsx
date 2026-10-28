import { DEMO_CHAPTERS, DEMO_CUES, type DemoChapterId } from '@mobywatel/content/demo-video';
import { type MouseEvent, type Ref, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';

import { useAppLocale } from '../../platform/i18n.ts';
import { DEMO_TRY, DEMO_VIDEO } from './demo.ts';
import styles from './demo-section.module.css';
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
    <section id={DEMO_ID} ref={ref} tabIndex={-1} className={styles.demo} aria-labelledby="showcase-demo">
      <div className={styles.text}>
        <h2 id="showcase-demo" className={styles.heading}>
          {t('demo.title')}
        </h2>
        <p className={styles.lead}>{t('demo.lead')}</p>

        <div className={styles.chapters} role="group" aria-label={t('demo.chaptersLabel')}>
          {DEMO_CHAPTERS.map(({ id }, i) => (
            <button
              key={id}
              type="button"
              className={styles.chapter}
              aria-pressed={chapter === id}
              onClick={() => jump(id)}
            >
              <span className={styles.chapterTime}>
                {i + 1}. {t(`demo.chapters.${id}.time`)}
              </span>
              {t(`demo.chapters.${id}.name`)}
            </button>
          ))}
        </div>

        <div className={styles.detail}>
          <p>{t(`demo.chapters.${shown}.body`)}</p>
          <a className={styles.try} href={DEMO_TRY[shown]} target={PHONE_FRAME} onClick={tryIt}>
            {t(`demo.chapters.${shown}.try`)}
          </a>
        </div>
        <p className={styles.note}>{t('demo.proposalNote')}</p>
      </div>

      <div className={styles.media}>
        {/* Silent (no audio track), so `muted` changes nothing but lets phones play it inline. */}
        <video
          ref={video}
          className={styles.video}
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
        <p className={styles.offline} role="status">
          {failed ? t('demo.offline') : null}
        </p>

        <details className={styles.transcript}>
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
