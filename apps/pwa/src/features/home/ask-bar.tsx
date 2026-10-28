import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';

const strokeClass = 'fill-none stroke-current stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]';

/**
 * Looks like the reference's prompt bar, but is a link: there is no text field until the assistant exists,
 * so nobody can type real data into it (prototype-guardrails skill).
 */
export function AskBar() {
  const t = useTranslations('documents');
  return (
    <Link
      className="flex min-h-[calc(var(--target-min)+var(--space-2))] items-center gap-2 rounded-pill border border-border bg-surface py-1 pr-1 pl-5 text-text-muted no-underline [box-shadow:0_0.25rem_1rem_-0.5rem_color-mix(in_srgb,var(--text)_30%,transparent)]"
      to={PATHS.assistant}
    >
      <span className="flex-1 text-md">{t('ask')}</span>
      <svg aria-hidden="true" className={strokeClass} viewBox="0 0 24 24" width="24" height="24">
        <rect x="9" y="3.5" width="6" height="11" rx="3" />
        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" />
      </svg>
      <span
        className="grid size-target flex-none place-items-center rounded-[50%] bg-accent text-accent-text"
        aria-hidden="true"
      >
        <svg className={strokeClass} viewBox="0 0 24 24" width="22" height="22">
          <path d="M12 18.5v-13M6.5 11 12 5.5l5.5 5.5" />
        </svg>
      </span>
    </Link>
  );
}
