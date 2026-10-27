import { CATEGORIES, type Category, type CategoryId, type MatterId } from '@mobywatel/content';
import type { DocumentKind } from '@mobywatel/core';
import type { ReactNode } from 'react';

// Card hues cycle so neighbouring bands always differ (brand tokens, no red).
const HUES = ['blue', 'brown', 'green', 'plum', 'teal', 'indigo', 'olive', 'slate'] as const;

// Polish slugs (address bar) and our own line icons (24 px grid). No shields, eagles or official symbols.
const META: Record<CategoryId, { slug: string; icon: ReactNode }> = {
  security: {
    slug: 'bezpieczenstwo',
    icon: (
      <>
        <rect x="5" y="10.5" width="14" height="10" rx="2" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5V17" />
      </>
    ),
  },
  vehicles: {
    slug: 'pojazdy',
    icon: (
      <>
        <path d="M4 16v-3.5L6 7h12l2 5.5V16M3.5 16h17v2.5h-17z" />
        <circle cx="7.5" cy="13" r="1" />
        <circle cx="16.5" cy="13" r="1" />
      </>
    ),
  },
  taxes: {
    slug: 'podatki',
    icon: (
      <>
        <path d="M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 17.5l5-6" />
        <circle cx="10" cy="12" r="0.9" />
        <circle cx="14" cy="17" r="0.9" />
      </>
    ),
  },
  zus: {
    slug: 'zus',
    icon: <path d="M3.5 12a8.5 8.5 0 0 1 17 0zM12 12v6.5a2 2 0 0 1-4 0M12 3.5V2.5" />,
  },
  studentCards: {
    slug: 'legitymacje',
    icon: (
      <>
        <rect x="5" y="7" width="14" height="13.5" rx="2" />
        <path d="M10 7V3.5h4V7M8.5 17.5c.6-1.3 2-2 3.5-2s2.9.7 3.5 2" />
        <circle cx="12" cy="12.5" r="2" />
      </>
    ),
  },
  travel: {
    slug: 'podroz',
    icon: (
      <>
        <rect x="3.5" y="7" width="17" height="12.5" rx="2" />
        <path d="M9 7V4.5h6V7M9 7v12.5M15 7v12.5" />
      </>
    ),
  },
  licences: {
    slug: 'uprawnienia',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M3.8 10.5h6.3M13.9 10.5h6.3M12 14v6.5" />
      </>
    ),
  },
  health: {
    slug: 'zdrowie',
    icon: (
      <path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10zM7 12h2.5l1.5-2 2 4 1.5-2H17" />
    ),
  },
  business: {
    slug: 'firma',
    icon: (
      <>
        <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
        <path d="M9 7.5v-2h6v2M3.5 12.5h17" />
      </>
    ),
  },
  payments: {
    slug: 'platnosci',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12.5" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </>
    ),
  },
  family: {
    slug: 'rodzina',
    icon: (
      <>
        <circle cx="8" cy="7.5" r="2.5" />
        <circle cx="16" cy="7.5" r="2.5" />
        <circle cx="12" cy="13.5" r="2" />
        <path d="M3.5 18.5c.5-3 2.3-5 4.5-5M20.5 18.5c-.5-3-2.3-5-4.5-5M8.5 21c.4-2 1.8-3.5 3.5-3.5s3.1 1.5 3.5 3.5" />
      </>
    ),
  },
  elections: {
    slug: 'wybory',
    icon: <path d="M4.5 12.5h15v8h-15zM9 12.5v-8h6v8M10.5 8.5l1.2 1.2 2-2.2" />,
  },
  environment: {
    slug: 'srodowisko',
    icon: <path d="M5 19c0-8 5-13.5 14.5-14-.5 9.5-6 14.5-14 14zM5 19l7-7" />,
  },
  other: {
    slug: 'reszta',
    icon: (
      <>
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
        <circle cx="16.75" cy="16.75" r="3.25" />
      </>
    ),
  },
};

// Matters in a category's submenu: Polish slugs and our own line icons. No cross (a protected emblem),
// no shields or official symbols.
export const MATTERS: Record<MatterId, { slug: string; icon: ReactNode }> = {
  blockPesel: {
    slug: 'zastrzez-pesel',
    icon: (
      <>
        <rect x="3" y="5" width="13" height="10" rx="2" />
        <path d="M6 9h5M6 12h3" />
        <rect x="14" y="15" width="7" height="5.5" rx="1" />
        <path d="M15.5 15v-1.5a2 2 0 0 1 4 0V15" />
      </>
    ),
  },
  blockDocument: {
    slug: 'zastrzez-dokument',
    icon: <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12l4 4M14 12l-4 4" />,
  },
  safeOnline: {
    slug: 'bezpiecznie-w-sieci',
    icon: <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M9 16.5l2 2 4-4" />,
  },
  checkId: {
    slug: 'sprawdz-dowod',
    icon: (
      <>
        <rect x="3" y="5" width="15" height="11" rx="2" />
        <path d="M6.5 9h5M6.5 12h3" />
        <circle cx="17" cy="16.5" r="3" />
        <path d="m19.2 18.7 2 2" />
      </>
    ),
  },
  checkPesel: {
    slug: 'sprawdz-pesel',
    icon: <path d="M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 15l5 5M8 9v3M10.5 9v3M13 9v3" />,
  },
  defenceTraining: {
    slug: 'szkolenia-obronne',
    icon: <path d="M3 20 12 4l9 16zM12 4v16M9 20l3-5 3 5" />,
  },
  safetyGuide: {
    slug: 'poradnik-bezpieczenstwa',
    icon: (
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7.5h6M9 10.5h4" />
    ),
  },
  collision: {
    slug: 'mstluczka',
    icon: (
      <path d="M3 15v-3l2-4h6v7zM21 15v-3l-2-4h-4l-1 2M14 15h7M6.5 17.5h.01M17.5 17.5h.01M12 3v3M9 4l1 2M15 4l-1 2" />
    ),
  },
  checkInsurance: {
    slug: 'sprawdz-oc',
    icon: (
      <>
        <path d="M4 15v-3l2-4.5h8L16 12v3zM4 15h12" />
        <circle cx="7" cy="17.5" r="1.5" />
        <circle cx="13" cy="17.5" r="1.5" />
        <path d="m16.5 6 2 2 3.5-4" />
      </>
    ),
  },
  penaltyPoints: {
    slug: 'punkty-karne',
    icon: (
      <>
        <circle cx="6" cy="7" r="2" />
        <circle cx="12" cy="7" r="2" />
        <circle cx="18" cy="7" r="2" />
        <circle cx="6" cy="14" r="2" />
        <circle cx="12" cy="14" r="2" />
        <path d="M4 20h16" />
      </>
    ),
  },
  driverLicence: {
    slug: 'uprawnienia-kierowcy',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M3.8 10.5h5.7M14.5 10.5h5.7M12 14.5v6" />
      </>
    ),
  },
  vehicleHistory: {
    slug: 'historia-pojazdu',
    icon: <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 4v4.5H8M12 7.5V12l3 2" />,
  },
  fines: {
    slug: 'mandaty',
    icon: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 11.5h6M9 15h3" />,
  },
  travelAbroad: {
    slug: 'odyseusz',
    icon: (
      <>
        <circle cx="11" cy="12" r="8" />
        <path d="M3 12h16M11 4c2 2.2 3 4.9 3 8s-1 5.8-3 8c-2-2.2-3-4.9-3-8s1-5.8 3-8z" />
        <path d="M19 13.5a2.5 2.5 0 0 0-2.5 2.5c0 1.9 2.5 4.5 2.5 4.5s2.5-2.6 2.5-4.5a2.5 2.5 0 0 0-2.5-2.5z" />
      </>
    ),
  },
  safeBus: {
    slug: 'bezpieczny-autobus',
    icon: (
      <>
        <rect x="3" y="4" width="14" height="13" rx="2" />
        <path d="M3 10h14M6.5 20v-3M13.5 20v-3M6 13.5h.01M14 13.5h.01M16.5 5.5l2 2 3.5-4" />
      </>
    ),
  },
  trainTickets: {
    slug: 'bilkom',
    icon: (
      <>
        <rect x="5" y="3" width="14" height="14" rx="3" />
        <path d="M5 10h14M9 13.5h.01M15 13.5h.01M8 21l2-4M16 21l-2-4" />
      </>
    ),
  },
  cityCard: {
    slug: 'karta-mka',
    icon: (
      <>
        <rect x="2.5" y="8" width="14" height="10" rx="2" />
        <path d="M5.5 14.5h5M18 6.5a5 5 0 0 1 0 7M20.5 4a8.5 8.5 0 0 1 0 12" />
      </>
    ),
  },
  cityTicket: {
    slug: 'bilet-miejski',
    icon: <path d="M3.5 7.5h17v3a2 2 0 0 0 0 3v3h-17v-3a2 2 0 0 0 0-3zM14 8.5v1.5M14 11.25v1.5M14 14v1.5" />,
  },
};

export function matterBySlug(category: CategoryView, slug: string | undefined): MatterId | undefined {
  return category.matters.find((m) => MATTERS[m].slug === slug);
}

export interface CategoryView extends Category {
  slug: string;
  icon: ReactNode;
  color: string;
}

export const CATEGORY_VIEWS: readonly CategoryView[] = CATEGORIES.map((c, i) => ({
  ...c,
  ...META[c.id],
  color: `var(--card-${HUES[i % HUES.length]})`,
}));

export function categoryBySlug(slug: string | undefined): CategoryView | undefined {
  return CATEGORY_VIEWS.find((c) => c.slug === slug);
}

export function categoryOfDocument(kind: DocumentKind): CategoryView | undefined {
  return CATEGORY_VIEWS.find((c) => c.documents.includes(kind));
}
