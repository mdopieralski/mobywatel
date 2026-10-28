import { UNOFFICIAL_DISCLAIMER, UNOFFICIAL_DISCLAIMERS } from '@mobywatel/brand';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button, ConfirmCard, type ConfirmCardProps, Disclaimer } from './index.ts';

describe('Button', () => {
  it('is a real button with an accessible name, type=button by default', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Dalej</Button>);
    const button = screen.getByRole('button', { name: 'Dalej' });
    expect(button.getAttribute('type')).toBe('button');
    await userEvent.tab();
    expect(document.activeElement).toBe(button);
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('Disclaimer', () => {
  it('renders the shared disclaimer text with the audit marker', () => {
    const { container } = render(<Disclaimer />);
    expect(screen.getByText(UNOFFICIAL_DISCLAIMER)).toBeTruthy();
    expect(container.querySelector('[data-disclaimer]')).not.toBeNull();
  });

  it('follows the UI language', () => {
    render(<Disclaimer locale="uk" />);
    expect(screen.getByText(UNOFFICIAL_DISCLAIMERS.uk)).toBeTruthy();
  });
});

describe('ConfirmCard', () => {
  afterEach(cleanup);

  const props = (over: Partial<ConfirmCardProps> = {}): ConfirmCardProps => ({
    title: 'Kupujesz bilet',
    rows: [
      { label: 'Miasto', value: 'Łódź' },
      { label: 'Cena', value: '3,40 zł' },
    ],
    source: { name: 'Źródło: przykładowy cennik.', checkedOn: 'Sprawdzone 28.10.2026.' },
    cancelLabel: 'Anuluj',
    onCancel: vi.fn(),
    actionLabel: 'Kup bilet',
    onConfirm: vi.fn(),
    ...over,
  });

  it('shows the rows and the source, and focuses its heading', () => {
    render(<ConfirmCard {...props()} />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Kupujesz bilet' });
    expect(document.activeElement).toBe(heading);
    expect(screen.getByText('Łódź')).toBeTruthy();
    expect(screen.getByText('3,40 zł')).toBeTruthy();
    expect(screen.getByText('Sprawdzone 28.10.2026.')).toBeTruthy();
  });

  it('calls onConfirm from the action and onCancel from cancel and from Escape', async () => {
    const p = props();
    render(<ConfirmCard {...p} />);
    await userEvent.click(screen.getByRole('button', { name: 'Kup bilet' }));
    expect(p.onConfirm).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'Anuluj' }));
    expect(p.onCancel).toHaveBeenCalledOnce();
    screen.getByRole('heading', { level: 2 }).focus();
    await userEvent.keyboard('{Escape}');
    expect(p.onCancel).toHaveBeenCalledTimes(2);
  });

  it('refuses to render without a source', () => {
    const { container } = render(<ConfirmCard {...props({ source: { name: ' ', checkedOn: '' } })} />);
    expect(container.innerHTML).toBe('');
    // The type requires a source; this is the runtime guard for untyped callers.
    const noSource = { ...props(), source: undefined } as unknown as ConfirmCardProps;
    const { container: none } = render(<ConfirmCard {...noSource} />);
    expect(none.innerHTML).toBe('');
  });
});
