// Small pieces every phone screen shares: icons, the tap ring, the top bar and the tab bar. Sizes follow the
// app at 390 × 844 (apps/pwa/src/app/layout.tsx, home/ask-bar.tsx) so the video looks like the app.
import type { Locale } from '@mobywatel/brand';
import { WORKING_NAME } from '@mobywatel/brand';
import type { CSSProperties, ReactNode } from 'react';

import { app } from '../copy.ts';
import { APP_FONT, C, progress, RADIUS } from '../theme.ts';

export const SCREEN_W = 390;
export const SCREEN_H = 844;

export function Icon({ children, size = 24, color }: { children: ReactNode; size?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{
        fill: 'none',
        stroke: color ?? 'currentColor',
        strokeWidth: 1.75,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        flex: 'none',
      }}
    >
      {children}
    </svg>
  );
}

/** Our app icon (the same drawing as the PWA's favicon), never an official mark. */
export function AppMark({ size = 40, draw = 1 }: { size?: number; draw?: number }) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} style={{ flex: 'none' }}>
      <rect width="512" height="512" rx="112" fill={C.accent} />
      <path
        d="M146 266 L226 346 L370 184"
        pathLength={1}
        fill="none"
        stroke={C.accentText}
        strokeWidth={56}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
    </svg>
  );
}

/**
 * Where the "user" touched: a soft ring that grows and fades around the element it sits in (the element
 * needs position: relative). `at` is the moment of the tap in the scene's seconds.
 */
export function Tap({ t, at }: { t: number; at: number }) {
  if (t < at - 0.25 || t > at + 0.6) {
    return null;
  }
  const grow = progress(t, at - 0.25, at + 0.45);
  const fade = 1 - progress(t, at + 0.1, at + 0.6);
  const size = 36 + grow * 40;
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: '50%',
        background: 'rgba(31, 95, 209, 0.18)',
        border: `3px solid ${C.focus}`,
        opacity: fade,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}

/** Pressed look for a short moment around a tap. */
export function pressed(t: number, at: number | undefined): boolean {
  return at !== undefined && t >= at - 0.1 && t <= at + 0.3;
}

const GLOBE = (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </>
);

export function TopBar({
  locale,
  t = 0,
  tapGlobe,
  offline = false,
}: {
  locale: Locale;
  t?: number;
  tapGlobe?: number;
  offline?: boolean;
}) {
  return (
    <div
      style={{
        height: 72,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        flex: 'none',
      }}
    >
      <AppMark />
      <span style={{ fontWeight: 700, fontSize: 20, color: C.text }}>{WORKING_NAME}</span>
      <span style={{ flex: 1 }} />
      {offline ? (
        <span style={{ color: C.textMuted, display: 'flex' }}>
          <Icon size={22}>
            <path d="M10.5 3.5h3l1 7 6 3v2l-6-1.5-.5 4 2 1.5v1.5L12 20l-4 1v-1.5l2-1.5-.5-4-6 1.5v-2l6-3z" />
          </Icon>
        </span>
      ) : null}
      <span style={{ color: C.text, display: 'flex', padding: '0 6px' }}>
        <Icon size={22}>
          <path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5M5.5 5h13l2 8.5V19h-17v-5.5z" />
        </Icon>
      </span>
      <span style={{ color: C.text, display: 'flex', padding: '0 6px' }}>
        <Icon size={22}>
          <path d="M18 16.5H6l1.5-2.5v-4a4.5 4.5 0 0 1 9 0v4zM10 19.5a2 2 0 0 0 4 0" />
        </Icon>
      </span>
      <span
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 8px',
          borderRadius: RADIUS.sm,
          color: pressed(t, tapGlobe) ? C.accent : C.text,
          background: pressed(t, tapGlobe) ? C.accentSoft : 'transparent',
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        <Icon size={20}>{GLOBE}</Icon>
        {locale.toUpperCase()}
        {tapGlobe === undefined ? null : <Tap t={t} at={tapGlobe} />}
      </span>
    </div>
  );
}

export function TabBar({ locale }: { locale: Locale }) {
  const tr = app(locale);
  const tab: CSSProperties = {
    flex: 1,
    display: 'grid',
    placeItems: 'center',
    fontSize: 17,
    fontWeight: 600,
  };
  return (
    <div
      style={{
        height: 48,
        display: 'flex',
        borderTop: `1px solid ${C.border}`,
        background: C.surface,
        flex: 'none',
      }}
    >
      <span style={{ ...tab, color: C.accent, boxShadow: `inset 0 3px 0 ${C.accent}` }}>
        {tr('common', 'nav.start')}
      </span>
      <span style={{ ...tab, color: C.textMuted }}>{tr('common', 'nav.settings')}</span>
    </div>
  );
}

export function AskBar({ locale }: { locale: Locale }) {
  return (
    <div style={{ padding: '8px 16px 12px', flex: 'none' }}>
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 6px 0 20px',
          borderRadius: RADIUS.pill,
          border: `1px solid ${C.border}`,
          background: C.surface,
          boxShadow: '0 4px 16px rgba(20, 24, 31, 0.08)',
        }}
      >
        <span style={{ flex: 1, color: C.textMuted, fontSize: 17 }}>{app(locale)('documents', 'ask')}</span>
        <span style={{ color: C.textMuted, display: 'flex' }}>
          <Icon size={22}>
            <rect x="9" y="3.5" width="6" height="11" rx="3" />
            <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" />
          </Icon>
        </span>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: C.accent,
            color: C.accentText,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon size={22}>
            <path d="M12 18.5v-13M6.5 11 12 5.5l5.5 5.5" />
          </Icon>
        </span>
      </div>
    </div>
  );
}

/** One app screen: top bar, content, (ask bar), tab bar. */
export function Screen({
  locale,
  children,
  ask = false,
  t,
  tapGlobe,
  offline,
}: {
  locale: Locale;
  children: ReactNode;
  ask?: boolean;
  t?: number;
  tapGlobe?: number;
  offline?: boolean;
}) {
  return (
    <div
      lang={locale}
      style={{
        width: SCREEN_W,
        height: SCREEN_H,
        display: 'flex',
        flexDirection: 'column',
        background: C.bg,
        color: C.text,
        fontFamily: APP_FONT,
        overflow: 'hidden',
      }}
    >
      <TopBar locale={locale} t={t} tapGlobe={tapGlobe} offline={offline} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px', position: 'relative' }}>{children}</div>
      {ask ? <AskBar locale={locale} /> : null}
      <TabBar locale={locale} />
    </div>
  );
}

export function BackLink({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginTop: 16,
        color: C.accent,
        fontSize: 17,
        fontWeight: 600,
        textDecoration: 'underline',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      ← {children}
    </div>
  );
}

export function HueTile({ color, size, children }: { color: string; size: number; children: ReactNode }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.md,
        background: color,
        color: C.cardText,
        display: 'grid',
        placeItems: 'center',
        flex: 'none',
      }}
    >
      <Icon size={size * 0.5}>{children}</Icon>
    </span>
  );
}

export function SoonPill({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        alignSelf: 'flex-start',
        padding: '4px 12px',
        borderRadius: RADIUS.pill,
        background: C.accentSoft,
        color: C.accent,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

/** The ">" at the end of a list row. */
export const CHEVRON = <path d="m9 6 6 6-6 6" />;
