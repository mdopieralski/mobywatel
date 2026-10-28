import { type KeyboardEvent, useEffect, useId, useRef } from 'react';

import { Button } from '../button/button.tsx';

export interface ConfirmRow {
  label: string;
  value: string;
}

/** Where the facts on the card come from. Both are display text in the UI language. */
export interface ConfirmSource {
  /** E.g. "Źródło: przykładowy cennik (ceny zmyślone)". */
  name: string;
  /** E.g. "Sprawdzone 28.10.2026". */
  checkedOn: string;
}

export interface ConfirmCardProps {
  /** What is about to happen, as a sentence. */
  title: string;
  /** The prefilled data the user is confirming. */
  rows: readonly ConfirmRow[];
  /** Required: a card that cannot say where its facts come from does not render. */
  source: ConfirmSource;
  cancelLabel: string;
  /** The caller then says "Nic nie zostało wysłane". */
  onCancel: () => void;
  /** A verb, never "OK": "Kup bilet", "Umów wizytę". */
  actionLabel: string;
  onConfirm: () => void;
  /** Heading level inside the screen. Default 2. */
  headingLevel?: 2 | 3;
}

/**
 * The last step before anything is "sent": what will happen, the data it uses, where that data comes from,
 * and two buttons. Focus moves to the heading when it opens, so a screen reader reads it first; Escape
 * cancels. Shared by every matter.
 */
export function ConfirmCard({
  title,
  rows,
  source,
  cancelLabel,
  onCancel,
  actionLabel,
  onConfirm,
  headingLevel = 2,
}: ConfirmCardProps) {
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const valid = Boolean(source?.name?.trim() && source?.checkedOn?.trim());

  useEffect(() => {
    heading.current?.focus();
  }, []);

  if (!valid) {
    return null;
  }

  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <section
      // One card style for every confirmation.
      className="grid gap-4 p-5 border-2 border-accent rounded-lg bg-surface text-text"
      aria-labelledby={headingId}
      onKeyDown={onKeyDown}
      data-confirm-card=""
    >
      <Heading
        id={headingId}
        ref={heading}
        tabIndex={-1} // No ring on the programmatic focus when it opens; a keyboard user gets the ring, further out.
        className="m-0 text-lg leading-tight [overflow-wrap:anywhere] [&:focus:not(:focus-visible)]:outline-none focus-visible:outline-offset-4"
      >
        {title}
      </Heading>
      <dl className="grid m-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap justify-between gap-y-1 gap-x-4 py-3 px-0 border-t border-border"
          >
            <dt className="text-text-muted">{row.label}</dt>
            <dd className="m-0 font-semibold [overflow-wrap:anywhere]">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="flex flex-wrap gap-y-0 gap-x-2 m-0 text-text-muted text-sm" data-source="">
        <span>{source.name}</span> <span>{source.checkedOn}</span>
      </p>
      <div className="grid gap-3">
        <Button variant="primary" fullWidth onClick={onConfirm}>
          {actionLabel}
        </Button>
        <Button variant="secondary" fullWidth onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </section>
  );
}
