// Message catalogue: apps/pwa/messages/<locale>/<namespace>.json, Polish is the source
// (plain-polish skill). Bundled, so copy works offline.
import common from '../../messages/pl/common.json';
import home from '../../messages/pl/home.json';
import settings from '../../messages/pl/settings.json';

export const LOCALE = 'pl';
export const TIME_ZONE = 'Europe/Warsaw';

export const MESSAGES = { common, home, settings };

export type Messages = typeof MESSAGES;
