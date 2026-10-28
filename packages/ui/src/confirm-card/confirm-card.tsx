import { type KeyboardEvent, useEffect, useId, useRef } from 'react';

import { Button } from '../button/button.tsx';
import styles from './confirm-card.module.css';

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
    <section className={styles.card} aria-labelledby={headingId} onKeyDown={onKeyDown} data-confirm-card="">
      <Heading id={headingId} ref={heading} tabIndex={-1} className={styles.title}>
        {title}
      </Heading>
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.source} data-source="">
        <span>{source.name}</span> <span>{source.checkedOn}</span>
      </p>
      <div className={styles.actions}>
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
