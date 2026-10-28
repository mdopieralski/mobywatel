// What sits around the app screens: the phone, the corner badge, the chapter panel and the caption.
import { DEMO_CHAPTERS, DEMO_CUES, DEMO_PROPOSALS, type DemoChapterId } from '@mobywatel/content/demo-video';
import type { ReactNode } from 'react';

import { SCREEN_H, SCREEN_W } from './app/parts.tsx';
import { cue, DEMO, V } from './copy.ts';
import { C, CHAPTER_HUE, progress, RADIUS } from './theme.ts';

const SCALE = 1.1;
const BEZEL = 14;
export const PHONE_W = SCREEN_W * SCALE + 2 * BEZEL;
export const PHONE_H = SCREEN_H * SCALE + 2 * BEZEL;

export function isProposal(globalT: number): boolean {
  return DEMO_PROPOSALS.some((p) => globalT >= p.from && globalT < p.to);
}

/** A generic phone: a rounded slab, no real model's outline or notch. */
export function Phone({ children, proposal }: { children: ReactNode; proposal: boolean }) {
  return (
    <div style={{ position: 'relative', width: PHONE_W, height: PHONE_H }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 56,
          background: C.text,
          padding: BEZEL,
          boxShadow: '0 30px 80px rgba(20, 24, 31, 0.22)',
        }}
      >
        <div
          style={{
            width: SCREEN_W * SCALE,
            height: SCREEN_H * SCALE,
            borderRadius: 44,
            overflow: 'hidden',
            position: 'relative',
            background: C.bg,
          }}
        >
          <div
            style={{
              width: SCREEN_W,
              height: SCREEN_H,
              transform: `scale(${SCALE})`,
              transformOrigin: '0 0',
            }}
          >
            {children}
          </div>
        </div>
      </div>
      {proposal ? (
        <>
          {/* Planned, not built: a dashed outline and the badge, so it can't pass for the working app. */}
          <div
            style={{
              position: 'absolute',
              inset: -18,
              borderRadius: 72,
              border: `4px dashed ${C.warning}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -38,
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            <Badge tone="proposal">{V.proposal}</Badge>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function Badge({ children, tone }: { children: ReactNode; tone: 'proposal' | 'live' | 'prototype' }) {
  const look = {
    proposal: { background: C.warning, color: C.cardText },
    live: { background: C.surface, color: C.success, border: `2px solid ${C.success}` },
    prototype: { background: C.surface, color: C.text, border: `2px solid ${C.borderStrong}` },
  }[tone];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '10px 22px',
        borderRadius: RADIUS.pill,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: 0.3,
        ...look,
      }}
    >
      {children}
    </span>
  );
}

/** In every frame, so even a cropped clip says what this is. */
export function PrototypeBadge() {
  return (
    <div style={{ position: 'absolute', left: 72, top: 56, zIndex: 20 }}>
      <Badge tone="prototype">{V.prototype}</Badge>
    </div>
  );
}

/** Burned-in Polish caption, only in the render for the submission (the page shows its own captions). */
export function Caption({ t }: { t: number }) {
  const current = DEMO_CUES.find((c) => t >= c.from && t < c.to);
  if (!current) {
    return null;
  }
  const opacity = Math.min(
    progress(t, current.from, current.from + 0.25),
    1 - progress(t, current.to - 0.2, current.to)
  );
  // In a chapter the phone fills the right side, so the caption sits under the panel on the left.
  const inChapter = DEMO_CHAPTERS.some((c) => t >= c.from && t < c.to);
  return (
    <div
      style={{
        position: 'absolute',
        left: inChapter ? 160 : 72,
        width: inChapter ? 920 : 1776,
        bottom: inChapter ? 120 : 56,
        display: 'flex',
        justifyContent: inChapter ? 'flex-start' : 'center',
        zIndex: 20,
      }}
    >
      <span
        style={{
          padding: '14px 28px',
          borderRadius: RADIUS.md,
          background: C.cardSlate,
          color: C.cardText,
          fontSize: 52,
          lineHeight: 1.3,
          fontWeight: 600,
          textAlign: inChapter ? 'left' : 'center',
          opacity,
        }}
      >
        {cue(current.key)}
      </span>
    </div>
  );
}

/**
 * A chapter: a title card in the chapter's hue for the first 3 s, then the panel on the left and the phone
 * on the right. `t` is seconds inside the chapter.
 */
export function ChapterLayout({
  id,
  t,
  phone,
  extra,
}: {
  id: DemoChapterId;
  t: number;
  phone: ReactNode;
  extra?: ReactNode;
}) {
  const index = DEMO_CHAPTERS.findIndex((c) => c.id === id);
  const chapter = DEMO_CHAPTERS[index];
  const globalT = (chapter?.from ?? 0) + t;
  const proposal = isProposal(globalT);
  const copy = DEMO.chapters[id];
  const card = 1 - progress(t, 2.6, 3.1);
  const enter = progress(t, 2.7, 3.5);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 250,
          width: 860,
          display: 'grid',
          gap: 28,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 24}px)`,
        }}
      >
        <span style={{ fontSize: 40, color: C.textMuted, fontWeight: 600 }}>
          {index + 1} / {DEMO_CHAPTERS.length} · {copy.time}
        </span>
        <span
          style={{
            fontSize: 112,
            lineHeight: 1.05,
            fontWeight: 800,
            color: CHAPTER_HUE[id],
            letterSpacing: -2,
          }}
        >
          {copy.name}
        </span>
        <span>
          <Badge tone={proposal ? 'proposal' : 'live'}>{proposal ? V.proposal : V.live}</Badge>
        </span>
        {extra}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 200,
          top: (1080 - PHONE_H) / 2 + 10,
          opacity: enter,
          transform: `translateX(${(1 - enter) * 40}px)`,
        }}
      >
        <Phone proposal={proposal}>{phone}</Phone>
      </div>
      {card > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: CHAPTER_HUE[id],
            color: C.cardText,
            display: 'grid',
            placeContent: 'center',
            justifyItems: 'center',
            gap: 20,
            opacity: card,
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 600, opacity: 0.9 }}>{copy.time}</span>
          <span style={{ fontSize: 150, fontWeight: 800, letterSpacing: -3 }}>{copy.name}</span>
        </div>
      ) : null}
    </div>
  );
}

/** Shows the screen whose start time has passed; a new one slides in from the right, as in the app. */
export function ScreenStack({
  t,
  screens,
}: {
  t: number;
  screens: readonly { from: number; el: ReactNode }[];
}) {
  let current = 0;
  screens.forEach((s, i) => {
    if (t >= s.from) {
      current = i;
    }
  });
  const shown = screens[current];
  const previous = screens[current - 1];
  if (!shown) {
    return null;
  }
  const p = current === 0 ? 1 : progress(t, shown.from, shown.from + 0.35);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {previous && p < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - p }}>{previous.el}</div>
      ) : null}
      <div style={{ position: 'absolute', inset: 0, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
        {shown.el}
      </div>
    </div>
  );
}
