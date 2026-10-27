import { UNOFFICIAL_DISCLAIMER, UNOFFICIAL_DISCLAIMERS } from '@mobywatel/brand';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button, Disclaimer } from './index.ts';

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
