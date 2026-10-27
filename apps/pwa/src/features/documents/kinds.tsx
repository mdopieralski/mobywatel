import type { DocumentKind, ReminderKind } from '@mobywatel/core';
import type { ReactNode } from 'react';

type KindKey = 'idCard' | 'drivingLicence' | 'familyCard' | 'vehicle';

// Our own line icons (24 px grid). Never official document art (prototype-guardrails skill).
export const KINDS: Record<DocumentKind, { slug: string; key: KindKey; color: string; icon: ReactNode }> = {
  'id-card': {
    slug: 'dowod',
    key: 'idCard',
    color: 'var(--card-blue)',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2.25" />
        <path d="M5.75 16.5c.7-1.6 1.9-2.4 3.25-2.4s2.55.8 3.25 2.4M14 10h4M14 13.5h3" />
      </>
    ),
  },
  'driving-licence': {
    slug: 'prawo-jazdy',
    key: 'drivingLicence',
    color: 'var(--card-plum)',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M3.8 10.5h6.3M13.9 10.5h6.3M12 14v6.5" />
      </>
    ),
  },
  'family-card': {
    slug: 'karta-duzej-rodziny',
    key: 'familyCard',
    color: 'var(--card-green)',
    icon: (
      <>
        <circle cx="8" cy="7.5" r="2.5" />
        <circle cx="16" cy="7.5" r="2.5" />
        <circle cx="12" cy="13.5" r="2" />
        <path d="M3.5 18.5c.5-3 2.3-5 4.5-5M20.5 18.5c-.5-3-2.3-5-4.5-5M8.5 21c.4-2 1.8-3.5 3.5-3.5s3.1 1.5 3.5 3.5" />
      </>
    ),
  },
  vehicle: {
    slug: 'pojazdy',
    key: 'vehicle',
    color: 'var(--card-brown)',
    icon: (
      <>
        <path d="M4 16v-3.5L6 7h12l2 5.5V16M3.5 16h17v2.5h-17z" />
        <circle cx="7.5" cy="13" r="1" />
        <circle cx="16.5" cy="13" r="1" />
      </>
    ),
  },
};

export function kindBySlug(slug: string | undefined): DocumentKind | undefined {
  return (Object.keys(KINDS) as DocumentKind[]).find((k) => KINDS[k].slug === slug);
}

type ReminderKey = 'taxLetter' | 'insuranceEnds' | 'propertyTax';

export const REMINDERS: Record<ReminderKind, { key: ReminderKey; icon: ReactNode }> = {
  'tax-letter': {
    key: 'taxLetter',
    icon: <path d="M3.5 6h17v12h-17zM4.5 7l7.5 6 7.5-6" />,
  },
  'insurance-ends': {
    key: 'insuranceEnds',
    icon: <path d="M4 16v-3.5L6 7h12l2 5.5V16M3.5 16h17v2.5h-17z" />,
  },
  'property-tax': {
    key: 'propertyTax',
    icon: <path d="M4 11.5 12 5l8 6.5M6 10v9.5h12V10M10 19.5v-5h4v5" />,
  },
};

export function LineIcon({ children, size = 24 }: { children: ReactNode; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} className="line-icon">
      {children}
    </svg>
  );
}
