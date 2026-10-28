// The five parts of "Jeden dzień z aplikacją". Times are seconds inside each part and line up with the
// captions in @mobywatel/content/demo-video (chapter start + local time = caption time).
import {
  LOCALE_NAMES,
  LOCALES,
  TAGLINE,
  UNOFFICIAL_DISCLAIMER,
  WORKING_NAME,
  type Locale,
} from '@mobywatel/brand';
import { useCurrentFrame } from 'remotion';

import { AppMark, Screen } from './app/parts.tsx';
import {
  TicketActive,
  TicketConfirm,
  TicketType,
  VisitConfirm,
  VisitDone,
  VisitSlot,
  VisitTopic,
} from './app/proposals.tsx';
import { CategoryScreen, CityPicker, LanguageMenu, SoonScreen, StartScreen } from './app/screens.tsx';
import { V } from './copy.ts';
import { ChapterLayout, ScreenStack } from './frame.tsx';
import { C, FPS, progress } from './theme.ts';

function useSeconds(): number {
  return useCurrentFrame() / FPS;
}

export function Intro() {
  const t = useSeconds();
  const show = progress(t, 0.2, 1);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeContent: 'center',
        justifyItems: 'center',
        gap: 36,
        textAlign: 'center',
        opacity: 1 - progress(t, 5.4, 6),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, opacity: show }}>
        <AppMark size={150} draw={progress(t, 0.6, 1.6)} />
        <span style={{ fontSize: 132, fontWeight: 800, letterSpacing: -3, color: C.text }}>
          {WORKING_NAME}
        </span>
      </div>
      <span style={{ fontSize: 60, fontWeight: 600, color: C.textMuted, opacity: progress(t, 0.5, 1.1) }}>
        {TAGLINE}
      </span>
      <p
        style={{
          margin: '24px 0 0',
          maxWidth: 1300,
          fontSize: 36,
          lineHeight: 1.4,
          color: C.text,
          // Fully on screen from 1.2 s to 5.4 s: at least 4 s (docs/product/demo-video.md §2).
          opacity: progress(t, 0.6, 1.2),
        }}
      >
        {UNOFFICIAL_DISCLAIMER}
      </p>
    </div>
  );
}

/** Morning: ZUS. Real screens up to "Wkrótce" (until 14.5 s), then the proposed visit booking. */
export function ZusChapter() {
  const t = useSeconds();
  const pl: Locale = 'pl';
  const screens = [
    {
      from: 0,
      el: (
        <Screen locale={pl} ask>
          <StartScreen locale={pl} t={t} tap={['zus', 5.6]} />
        </Screen>
      ),
    },
    {
      from: 6,
      el: (
        <Screen locale={pl}>
          <CategoryScreen locale={pl} id="zus" t={t} tap={['zusVisit', 10.4]} />
        </Screen>
      ),
    },
    {
      from: 10.8,
      el: (
        <Screen locale={pl}>
          <SoonScreen locale={pl} category="zus" matter="zusVisit" />
        </Screen>
      ),
    },
    {
      from: 14.5,
      el: (
        <Screen locale={pl}>
          <VisitTopic t={t} at={16.3} />
        </Screen>
      ),
    },
    {
      from: 16.8,
      el: (
        <Screen locale={pl}>
          <VisitSlot t={t} at={17.9} />
        </Screen>
      ),
    },
    {
      from: 18.4,
      el: (
        <Screen locale={pl}>
          <VisitConfirm t={t} at={20.9} />
        </Screen>
      ),
    },
    {
      from: 21.3,
      el: (
        <Screen locale={pl}>
          <VisitDone />
        </Screen>
      ),
    },
  ];
  return <ChapterLayout id="zus" t={t} phone={<ScreenStack t={t} screens={screens} />} />;
}

/** On the way: the city picker works today (typing "lodz" finds Łódź); buying is the proposal (from 11 s). */
export function TicketsChapter() {
  const t = useSeconds();
  const pl: Locale = 'pl';
  const word = 'lodz';
  const typed = word.slice(0, Math.max(0, Math.min(word.length, Math.floor((t - 7.3) / 0.3) + 1)));
  const screens = [
    {
      from: 0,
      el: (
        <Screen locale={pl} ask>
          <StartScreen locale={pl} t={t} tap={['travel', 4.4]} />
        </Screen>
      ),
    },
    {
      from: 4.8,
      el: (
        <Screen locale={pl}>
          <CategoryScreen locale={pl} id="travel" t={t} tap={['cityTicket', 6.2]} />
        </Screen>
      ),
    },
    {
      from: 6.6,
      el: (
        <Screen locale={pl}>
          <SoonScreen locale={pl} category="travel" matter="cityTicket">
            <CityPicker locale={pl} typed={t < 7.3 ? '' : typed} chosen={t >= 10} t={t} tapCity={9.6} />
          </SoonScreen>
        </Screen>
      ),
    },
    {
      from: 11,
      el: (
        <Screen locale={pl}>
          <TicketType t={t} at={13.4} />
        </Screen>
      ),
    },
    {
      from: 13.9,
      el: (
        <Screen locale={pl}>
          <TicketConfirm t={t} at={17.9} />
        </Screen>
      ),
    },
    {
      from: 18.4,
      el: (
        <Screen locale={pl}>
          {/* 24 h ticket, counting down from 23 h 59 min. */}
          <TicketActive minutesLeft={24 * 60 - 1 - Math.floor(Math.max(0, t - 18.4) * 2)} />
        </Screen>
      ),
    },
  ];
  return <ChapterLayout id="tickets" t={t} phone={<ScreenStack t={t} screens={screens} />} />;
}

const CYCLE_FROM = 14.5;
const CYCLE_STEP = 0.68;

/**
 * Evening: the neighbour switches to Ukrainian, the whole app changes; airplane mode, German still works;
 * then "Twoje sprawy" in all 8 languages. All of it works in the prototype today.
 */
export function LanguagesChapter() {
  const t = useSeconds();
  const offline = t >= 11;
  const cycling = t >= CYCLE_FROM;
  const cycleLocale =
    LOCALES[Math.min(LOCALES.length - 1, Math.floor((t - CYCLE_FROM) / CYCLE_STEP))] ?? 'pl';
  const start = (locale: Locale, tapGlobe?: number) => (
    <Screen locale={locale} ask t={t} tapGlobe={tapGlobe} offline={offline}>
      <StartScreen locale={locale} />
    </Screen>
  );
  const withMenu = (locale: Locale, tap: [Locale, number]) => (
    <div style={{ position: 'relative' }}>
      {start(locale)}
      <LanguageMenu current={locale} t={t} tap={tap} />
    </div>
  );
  const screens = [
    { from: 0, el: start('pl', 4.5) },
    { from: 4.8, el: withMenu('pl', ['uk', 6.3]) },
    { from: 6.7, el: start('uk', 11.9) },
    { from: 12.2, el: withMenu('uk', ['de', 13.4]) },
    { from: 13.8, el: start('de') },
    ...LOCALES.map((l, i) => ({ from: CYCLE_FROM + i * CYCLE_STEP, el: start(l) })),
  ];
  const extra = cycling ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
      {LOCALES.map((l) => (
        <span
          key={l}
          lang={l}
          style={{
            padding: '8px 18px',
            borderRadius: 999,
            fontSize: 30,
            fontWeight: 600,
            background: l === cycleLocale ? C.cardPlum : C.surface,
            color: l === cycleLocale ? C.cardText : C.text,
            border: `2px solid ${l === cycleLocale ? C.cardPlum : C.border}`,
          }}
        >
          {LOCALE_NAMES[l]}
        </span>
      ))}
    </div>
  ) : offline ? (
    <span style={{ fontSize: 34, fontWeight: 600, color: C.textMuted }}>✈ {V.offline}</span>
  ) : null;
  return <ChapterLayout id="languages" t={t} phone={<ScreenStack t={t} screens={screens} />} extra={extra} />;
}

export function Outro() {
  const t = useSeconds();
  const show = progress(t, 0, 0.8);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeContent: 'center',
        justifyItems: 'center',
        gap: 32,
        textAlign: 'center',
        opacity: show,
      }}
    >
      <AppMark size={120} />
      <span style={{ fontSize: 110, fontWeight: 800, letterSpacing: -2, color: C.text }}>{V.outroTitle}</span>
      <span
        style={{
          padding: '18px 40px',
          borderRadius: 999,
          background: C.accentSoft,
          color: C.accent,
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        {V.url}
      </span>
      <span style={{ fontSize: 40, color: C.textMuted }}>{V.outroBody}</span>
      <p style={{ margin: '24px 0 0', maxWidth: 1300, fontSize: 34, lineHeight: 1.4, color: C.text }}>
        {UNOFFICIAL_DISCLAIMER}
      </p>
    </div>
  );
}
