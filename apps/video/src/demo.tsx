// "Jeden dzień z aplikacją": the whole demo in one composition (docs/product/demo-video.md).
import { DEMO_CHAPTERS } from '@mobywatel/content/demo-video';
import type { CSSProperties } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';

import { Caption, PrototypeBadge } from './frame.tsx';
import { Intro, LanguagesChapter, Outro, TicketsChapter, ZusChapter } from './scenes.tsx';
import { C, f, FPS, VIDEO_FONT } from './theme.ts';

// A type, not an interface: Remotion wants props that fit Record<string, unknown>.
export type DemoProps = {
  /** Burn the Polish captions in (the copy for the submission form); the landing page adds its own. */
  captions: boolean;
};

// The app's card colours as the CSS variables its icons and tiles expect (var(--card-<hue>)).
const CARD_VARS = {
  '--card-blue': C.cardBlue,
  '--card-plum': C.cardPlum,
  '--card-green': C.cardGreen,
  '--card-brown': C.cardBrown,
  '--card-teal': C.cardTeal,
  '--card-indigo': C.cardIndigo,
  '--card-olive': C.cardOlive,
  '--card-slate': C.cardSlate,
} as CSSProperties;

const SCENES = { zus: ZusChapter, tickets: TicketsChapter, languages: LanguagesChapter } as const;

export function Demo({ captions }: DemoProps) {
  const t = useCurrentFrame() / FPS;
  const first = DEMO_CHAPTERS[0]?.from ?? 0;
  const last = DEMO_CHAPTERS.at(-1)?.to ?? 0;
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: VIDEO_FONT, color: C.text, ...CARD_VARS }}>
      <Sequence durationInFrames={f(first)} name="Intro">
        <Intro />
      </Sequence>
      {DEMO_CHAPTERS.map(({ id, from, to }) => {
        const Scene = SCENES[id];
        return (
          <Sequence key={id} from={f(from)} durationInFrames={f(to - from)} name={id}>
            <Scene />
          </Sequence>
        );
      })}
      <Sequence from={f(last)} name="Outro">
        <Outro />
      </Sequence>
      <PrototypeBadge />
      {captions ? <Caption t={t} /> : null}
    </AbsoluteFill>
  );
}
