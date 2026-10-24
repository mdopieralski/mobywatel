// Design tokens. The only place hex colours live (the post-edit hook blocks them elsewhere).
// Visual language: calm, neutral, high contrast. No white-red / emblem cues (prototype-guardrails skill).

export type ThemeName = 'light' | 'dark';

export interface ColorTokens {
  bg: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  focus: string;
  danger: string;
  warning: string;
  success: string;
  watermark: string;
}

export const COLORS: Record<ThemeName, ColorTokens> = {
  light: {
    bg: '#F5F7F9',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    text: '#14181F',
    textMuted: '#49525E',
    border: '#D5DAE1',
    borderStrong: '#6B7480',
    accent: '#0A6660',
    accentText: '#FFFFFF',
    accentSoft: '#E1F2F0',
    focus: '#1F5FD1',
    danger: '#A8231B',
    warning: '#7D4A00',
    success: '#1D6631',
    watermark: 'rgba(20, 24, 31, 0.07)',
  },
  dark: {
    bg: '#0F1318',
    surface: '#171C23',
    surfaceRaised: '#1F252E',
    text: '#EEF1F5',
    textMuted: '#A9B2BF',
    border: '#2C333D',
    borderStrong: '#7A8494',
    accent: '#5CC8BF',
    accentText: '#0F1318',
    accentSoft: '#173431',
    focus: '#8AB4FF',
    danger: '#FF8A80',
    warning: '#F2B66D',
    success: '#7BD58F',
    watermark: 'rgba(238, 241, 245, 0.08)',
  },
};

/** Text/background pairs that must reach WCAG AA (checked in tokens.test.ts). */
export const CONTRAST_PAIRS: ReadonlyArray<[keyof ColorTokens, keyof ColorTokens, number]> = [
  ['text', 'bg', 4.5],
  ['text', 'surface', 4.5],
  ['textMuted', 'bg', 4.5],
  ['textMuted', 'surface', 4.5],
  ['accentText', 'accent', 4.5],
  ['accent', 'surface', 4.5],
  ['accent', 'accentSoft', 4.5],
  ['danger', 'surface', 4.5],
  ['warning', 'surface', 4.5],
  ['success', 'surface', 4.5],
  ['borderStrong', 'surface', 3],
  ['focus', 'bg', 3],
  ['focus', 'surface', 3],
];

/** Type scale in px. Senior scale raises the base to 20 px (accessibility skill). */
export const FONT_SIZE = {
  regular: { xs: 13, sm: 15, md: 17, lg: 20, xl: 24, '2xl': 30, '3xl': 36 },
  senior: { xs: 17, sm: 19, md: 21, lg: 25, xl: 30, '2xl': 36, '3xl': 42 },
} as const;

export const FONT_FAMILY =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Helvetica Neue', Arial, sans-serif";

export const LINE_HEIGHT = { tight: 1.25, body: 1.5 } as const;

/** 4-px grid. */
export const SPACE = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 48 } as const;

export const TARGET_MIN = { regular: 48, senior: 56 } as const;

export const RADIUS = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const DURATION = { fast: 120, base: 200, slow: 320 } as const;

export const EASING = { standard: 'cubic-bezier(0.2, 0, 0, 1)' } as const;

/** Manifest / meta colours. */
export const THEME_COLOR = COLORS.light.accent;
export const BACKGROUND_COLOR = COLORS.light.bg;
