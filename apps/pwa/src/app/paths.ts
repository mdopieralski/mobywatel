// Polish paths: they show in the address bar and in shared links.

/** Where the app lives. "/" is the landing page on a desktop; elsewhere it forwards here. */
export const PROTOTYPE = '/prototype';

export const PATHS = {
  landing: '/',
  start: PROTOTYPE,
  settings: `${PROTOTYPE}/ustawienia`,
  categories: `${PROTOTYPE}/kategorie`,
  documents: `${PROTOTYPE}/dokumenty`,
  reminders: `${PROTOTYPE}/do-zalatwienia`,
  assistant: `${PROTOTYPE}/asystent`,
  inbox: `${PROTOTYPE}/skrzynka`,
  notifications: `${PROTOTYPE}/powiadomienia`,
  // Team page outside the app shell and its navigation; loaded only when opened.
  brandVoice: '/brand-voice',
} as const;

/** True for /prototype and everything under it. */
export function isPrototypePath(pathname: string): boolean {
  return pathname === PROTOTYPE || pathname.startsWith(`${PROTOTYPE}/`);
}
