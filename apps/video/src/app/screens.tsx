// The app's own screens, drawn for the video from the app's catalogues and icons: start, a category, a
// "Wkrótce" matter, the city picker and the language menu. What exists in the prototype looks the same here.
import { LOCALE_NAMES, LOCALES, type Locale } from '@mobywatel/brand';
import type { CategoryId, MatterId } from '@mobywatel/content';

import { CATEGORY_VIEWS, MATTERS } from '../../../pwa/src/features/categories/categories.tsx';
import { app } from '../copy.ts';
import { C, RADIUS } from '../theme.ts';
import { BackLink, CHEVRON, HueTile, Icon, pressed, SoonPill, Tap } from './parts.tsx';

function view(id: CategoryId) {
  const found = CATEGORY_VIEWS.find((c) => c.id === id);
  if (!found) {
    throw new Error(`No category ${id}`);
  }
  return found;
}

/** "Twoje sprawy": the first six category tiles, two columns. */
export function StartScreen({
  locale,
  t = 0,
  tap,
}: {
  locale: Locale;
  t?: number;
  tap?: [CategoryId, number];
}) {
  const tr = app(locale);
  return (
    <>
      <h1 style={{ margin: '12px 0 16px', fontSize: 26, lineHeight: 1.25 }}>{tr('categories', 'title')}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {CATEGORY_VIEWS.slice(0, 8).map((c) => {
          const at = tap?.[0] === c.id ? tap[1] : undefined;
          return (
            <div
              key={c.id}
              style={{
                position: 'relative',
                height: 160,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: RADIUS.lg,
                border: `1px solid ${C.border}`,
                background: pressed(t, at) ? C.accentSoft : C.surface,
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: RADIUS.md,
                  background: C.bg,
                  display: 'grid',
                  placeItems: 'center',
                  color: C.text,
                }}
              >
                <Icon size={22}>{c.icon}</Icon>
              </span>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{tr('categories', `names.${c.id}`)}</span>
              {at === undefined ? null : <Tap t={t} at={at} />}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Heading({ color, icon, title }: { color: string; icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
      <HueTile color={color} size={52}>
        {icon}
      </HueTile>
      <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>{title}</h1>
    </div>
  );
}

/** A category and its list of matters. */
export function CategoryScreen({
  locale,
  id,
  t = 0,
  tap,
}: {
  locale: Locale;
  id: CategoryId;
  t?: number;
  tap?: [MatterId, number];
}) {
  const tr = app(locale);
  const c = view(id);
  return (
    <>
      <BackLink>{tr('categories', 'back')}</BackLink>
      <Heading color={c.color} icon={c.icon} title={tr('categories', `names.${id}`)} />
      <p style={{ margin: '14px 0 18px', color: C.textMuted, fontSize: 17, lineHeight: 1.5 }}>
        {tr('categories', `descriptions.${id}`)}
      </p>
      <h2 style={{ margin: '0 0 12px', fontSize: 19 }}>{tr('categories', 'matters.title')}</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {c.matters.map((m) => {
          const at = tap?.[0] === m ? tap[1] : undefined;
          return (
            <div
              key={m}
              style={{
                position: 'relative',
                height: 62,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 14px',
                borderRadius: RADIUS.lg,
                border: `1px solid ${C.border}`,
                background: pressed(t, at) ? C.accentSoft : C.surface,
              }}
            >
              <HueTile color={c.color} size={40}>
                {MATTERS[m].icon}
              </HueTile>
              <span style={{ flex: 1, fontSize: 17, fontWeight: 700 }}>
                {tr('categories', `matters.names.${m}`)}
              </span>
              <Icon size={20} color={C.textMuted}>
                {CHEVRON}
              </Icon>
              {at === undefined ? null : <Tap t={t} at={at} />}
            </div>
          );
        })}
      </div>
    </>
  );
}

/** A matter that isn't built: the honest "Wkrótce" screen the prototype shows today. */
export function SoonScreen({
  locale,
  category,
  matter,
  children,
}: {
  locale: Locale;
  category: CategoryId;
  matter: MatterId;
  children?: React.ReactNode;
}) {
  const tr = app(locale);
  const c = view(category);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <BackLink>{tr('categories', `names.${category}`)}</BackLink>
      <Heading
        color={c.color}
        icon={MATTERS[matter].icon}
        title={tr('categories', `matters.names.${matter}`)}
      />
      <div style={{ marginTop: 14 }}>
        <SoonPill>{tr('soon', 'badge')}</SoonPill>
      </div>
      <p style={{ margin: '14px 0 0', color: C.textMuted, fontSize: 17, lineHeight: 1.5 }}>
        {tr('categories', `matters.descriptions.${matter}`)}
      </p>
      {children ?? (
        <p style={{ margin: '12px 0 0', color: C.textMuted, fontSize: 15, lineHeight: 1.5 }}>
          {tr('categories', 'matters.soon')}
        </p>
      )}
    </div>
  );
}

/**
 * The city picker inside "Bilet miejski" (it works offline in the prototype). `typed` is what the user has
 * typed so far; `chosen` shows the saved city and the "dodamy wkrótce" line.
 */
export function CityPicker({
  locale,
  typed,
  chosen,
  t = 0,
  tapCity,
}: {
  locale: Locale;
  typed: string;
  chosen: boolean;
  t?: number;
  tapCity?: number;
}) {
  const tr = app(locale);
  const card = {
    marginTop: 16,
    padding: 16,
    borderRadius: RADIUS.lg,
    border: `1px solid ${C.border}`,
    background: C.surface,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  };
  const row = (name: string, region: string, at?: number) => (
    <div
      key={name}
      style={{
        position: 'relative',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        borderRadius: RADIUS.md,
        border: `1px solid ${C.border}`,
        background: pressed(t, at) ? C.accentSoft : C.bg,
        fontSize: 17,
      }}
    >
      <strong>{name}</strong>
      <span style={{ color: C.textMuted, fontSize: 15 }}>{region}</span>
      {at === undefined ? null : <Tap t={t} at={at} />}
    </div>
  );
  if (chosen) {
    return (
      <div style={card}>
        <span style={{ color: C.textMuted, fontSize: 15 }}>{tr('categories', 'cityPicker.chosen')}</span>
        <strong style={{ fontSize: 24 }}>Łódź</strong>
        <span style={{ color: C.textMuted, fontSize: 15 }}>
          {tr('categories', 'cityPicker.voivodeship').replace('{name}', 'łódzkie')}
        </span>
        <p style={{ margin: '6px 0 0', fontSize: 17, lineHeight: 1.5 }}>
          {tr('categories', 'cityPicker.soon').replace('{city}', 'Łódź')}
        </p>
      </div>
    );
  }
  return (
    <div style={card}>
      <strong style={{ fontSize: 20 }}>{tr('categories', 'cityPicker.title')}</strong>
      <span style={{ fontWeight: 700, fontSize: 17 }}>{tr('categories', 'cityPicker.label')}</span>
      <span style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.45 }}>
        {tr('categories', 'cityPicker.hint')}
      </span>
      <div
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          borderRadius: RADIUS.md,
          border: `2px solid ${typed ? C.focus : C.borderStrong}`,
          fontSize: 18,
        }}
      >
        {typed}
        <span style={{ width: 2, height: 24, marginLeft: 1, background: typed ? C.text : 'transparent' }} />
      </div>
      {typed.length >= 3 ? (
        <>
          <span style={{ color: C.textMuted, fontSize: 15 }}>Pasuje 1 miasto.</span>
          {row('Łódź', 'łódzkie', tapCity)}
        </>
      ) : (
        <>
          <span style={{ color: C.textMuted, fontSize: 15 }}>{tr('categories', 'cityPicker.biggest')}</span>
          {row('Warszawa', 'mazowieckie')}
          {row('Kraków', 'małopolskie')}
          {row('Wrocław', 'dolnośląskie')}
        </>
      )}
    </div>
  );
}

/** The language menu under the globe button: each language in its own name. */
export function LanguageMenu({
  current,
  t = 0,
  tap,
}: {
  current: Locale;
  t?: number;
  tap?: [Locale, number];
}) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 12,
        top: 64,
        width: 222,
        padding: 8,
        borderRadius: RADIUS.lg,
        border: `1px solid ${C.border}`,
        background: C.surface,
        boxShadow: '0 12px 32px rgba(20, 24, 31, 0.16)',
        zIndex: 4,
      }}
    >
      {LOCALES.map((l) => {
        const at = tap?.[0] === l ? tap[1] : undefined;
        const on = l === current || pressed(t, at);
        return (
          <div
            key={l}
            lang={l}
            style={{
              position: 'relative',
              height: 46,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 12px',
              borderRadius: RADIUS.sm,
              background: on ? C.accentSoft : 'transparent',
              color: on ? C.accent : C.text,
              fontSize: 17,
              fontWeight: on ? 700 : 400,
            }}
          >
            <span style={{ width: 24, fontSize: 14, color: on ? C.accent : C.textMuted }}>
              {l.toUpperCase()}
            </span>
            {LOCALE_NAMES[l]}
            {at === undefined ? null : <Tap t={t} at={at} />}
          </div>
        );
      })}
    </div>
  );
}
