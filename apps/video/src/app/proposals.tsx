// Screens we propose but haven't built: the ZUS visit and buying a city ticket. The video frames them with a
// dashed outline and the "Propozycja" badge (docs/product/demo-video.md §2). Fictional data, our own
// artwork: no logos, no scannable code, and the ticket carries a "nie jest biletem" watermark.
import type { ReactNode } from 'react';

import { CATEGORY_VIEWS, MATTERS } from '../../../pwa/src/features/categories/categories.tsx';
import { V } from '../copy.ts';
import { C, RADIUS } from '../theme.ts';
import { BackLink, HueTile, Icon, pressed, Tap } from './parts.tsx';

// The same colour the app gives each category.
const hue = (id: 'zus' | 'travel') => CATEGORY_VIEWS.find((c) => c.id === id)?.color ?? C.cardSlate;
const ZUS_HUE = hue('zus');
const TRAVEL_HUE = hue('travel');

function Title({ color, icon, children }: { color: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0 18px' }}>
      <HueTile color={color} size={52}>
        {icon}
      </HueTile>
      <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>{children}</h1>
    </div>
  );
}

function Question({ children }: { children: ReactNode }) {
  return <h2 style={{ margin: '0 0 12px', fontSize: 20, lineHeight: 1.3 }}>{children}</h2>;
}

function Choice({
  children,
  aside,
  t,
  at,
  selected,
}: {
  children: ReactNode;
  aside?: ReactNode;
  t: number;
  at?: number;
  selected?: boolean;
}) {
  const on = selected || pressed(t, at);
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${on ? C.accent : C.border}`,
        background: on ? C.accentSoft : C.surface,
        color: on ? C.accent : C.text,
        fontSize: 18,
        fontWeight: 700,
      }}
    >
      {children}
      {aside ? <span style={{ fontWeight: 400, color: C.textMuted }}>{aside}</span> : null}
      {at === undefined ? null : <Tap t={t} at={at} />}
    </div>
  );
}

function Button({
  children,
  t,
  at,
  primary = true,
}: {
  children: ReactNode;
  t: number;
  at?: number;
  primary?: boolean;
}) {
  const down = pressed(t, at);
  return (
    <div
      style={{
        position: 'relative',
        height: 56,
        display: 'grid',
        placeItems: 'center',
        borderRadius: RADIUS.pill,
        background: primary ? C.accent : C.surface,
        border: primary ? 'none' : `2px solid ${C.accent}`,
        color: primary ? C.accentText : C.accent,
        fontSize: 18,
        fontWeight: 700,
        transform: down ? 'scale(0.97)' : 'none',
      }}
    >
      {children}
      {at === undefined ? null : <Tap t={t} at={at} />}
    </div>
  );
}

/** ConfirmCard: what we will send, where, and the user's data, before anything happens. */
function Confirm({
  title,
  rows,
  confirm,
  change,
  t,
  at,
}: {
  title: string;
  rows: readonly (readonly [string, string])[];
  confirm: string;
  change: string;
  t: number;
  at?: number;
}) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: RADIUS.lg,
        border: `1px solid ${C.border}`,
        background: C.surface,
        display: 'grid',
        gap: 14,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 22, lineHeight: 1.3 }}>{title}</h2>
      <dl style={{ margin: 0, display: 'grid', gap: 10 }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: 'grid', gap: 2 }}>
            <dt style={{ color: C.textMuted, fontSize: 15 }}>{k}</dt>
            <dd style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{v}</dd>
          </div>
        ))}
      </dl>
      <Button t={t} at={at}>
        {confirm}
      </Button>
      <Button t={t} primary={false}>
        {change}
      </Button>
    </div>
  );
}

function Done({ title, body, note }: { title: string; body: string; note: string }) {
  return (
    <div style={{ display: 'grid', justifyItems: 'center', textAlign: 'center', gap: 14, marginTop: 70 }}>
      <span
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: C.success,
          color: C.cardText,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Icon size={48}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </Icon>
      </span>
      <h2 style={{ margin: 0, fontSize: 28 }}>{title}</h2>
      <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5 }}>{body}</p>
      <p style={{ margin: 0, fontSize: 15, color: C.textMuted }}>{note}</p>
    </div>
  );
}

// ZUS visit -----------------------------------------------------------------------------------------------

export function VisitTopic({ t, at }: { t: number; at: number }) {
  return (
    <>
      <BackLink>ZUS</BackLink>
      <Title color={ZUS_HUE} icon={MATTERS.zusVisit.icon}>
        {V.visit.title}
      </Title>
      <Question>{V.visit.topicQuestion}</Question>
      <div style={{ display: 'grid', gap: 10 }}>
        {V.visit.topics.map((topic, i) => (
          <Choice key={topic} t={t} at={i === 0 ? at : undefined}>
            {topic}
          </Choice>
        ))}
      </div>
    </>
  );
}

export function VisitSlot({ t, at }: { t: number; at: number }) {
  return (
    <>
      <BackLink>ZUS</BackLink>
      <Title color={ZUS_HUE} icon={MATTERS.zusVisit.icon}>
        {V.visit.title}
      </Title>
      <Question>{V.visit.slotQuestion}</Question>
      <p style={{ margin: '0 0 14px', fontSize: 15, color: C.textMuted, lineHeight: 1.45 }}>
        {V.visit.place}
      </p>
      {V.visit.days.map((day, d) => (
        <div key={day} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{day}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {V.visit.times.map((time, i) => (
              <Choice key={time} t={t} at={d === 0 && i === 1 ? at : undefined}>
                {time}
              </Choice>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export function VisitConfirm({ t, at }: { t: number; at: number }) {
  return (
    <div style={{ paddingTop: 20 }}>
      <Confirm
        title={V.visit.confirmTitle}
        rows={V.visit.rows}
        confirm={V.visit.confirm}
        change={V.visit.change}
        t={t}
        at={at}
      />
    </div>
  );
}

export function VisitDone() {
  return <Done title={V.visit.doneTitle} body={V.visit.doneBody} note={V.visit.nothingSent} />;
}

// City ticket ---------------------------------------------------------------------------------------------

export function TicketType({ t, at }: { t: number; at: number }) {
  return (
    <>
      <BackLink>{V.ticket.city}</BackLink>
      <Title color={TRAVEL_HUE} icon={MATTERS.cityTicket.icon}>
        {V.ticket.title}
      </Title>
      <Question>{V.ticket.typeQuestion}</Question>
      <div style={{ display: 'grid', gap: 10 }}>
        {V.ticket.types.map(([name, price], i) => (
          <Choice key={name} aside={price} t={t} at={i === 2 ? at : undefined}>
            {name}
          </Choice>
        ))}
      </div>
      <p style={{ margin: '14px 0 0', fontSize: 15, color: C.textMuted }}>{V.ticket.priceNote}</p>
    </>
  );
}

export function TicketConfirm({ t, at }: { t: number; at: number }) {
  return (
    <div style={{ paddingTop: 20 }}>
      <Confirm
        title={V.ticket.confirmTitle}
        rows={V.ticket.rows}
        confirm={V.ticket.confirm}
        change={V.ticket.change}
        t={t}
        at={at}
      />
    </div>
  );
}

/** The bought ticket: a neutral card with a countdown and the watermark. No QR code, nothing to scan. */
export function TicketActive({ minutesLeft }: { minutesLeft: number }) {
  const h = Math.floor(minutesLeft / 60);
  const m = minutesLeft % 60;
  return (
    <div style={{ paddingTop: 20, display: 'grid', gap: 14 }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>{V.ticket.activeTitle}</h1>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 22,
          borderRadius: RADIUS.lg,
          background: TRAVEL_HUE,
          color: C.cardText,
          display: 'grid',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16, opacity: 0.9 }}>{V.ticket.city}</span>
        <strong style={{ fontSize: 26 }}>{V.ticket.activeType}</strong>
        <span style={{ fontSize: 16, opacity: 0.9, marginTop: 10 }}>{V.ticket.validFor}</span>
        <strong style={{ fontSize: 44, fontVariantNumeric: 'tabular-nums' }}>
          {h} h {String(m).padStart(2, '0')} min
        </strong>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '55%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 1,
            opacity: 0.4,
            whiteSpace: 'nowrap',
          }}
        >
          {V.ticket.watermark}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 15, color: C.textMuted }}>{V.ticket.nothingPaid}</p>
    </div>
  );
}
