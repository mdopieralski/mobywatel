import {
  COLORS,
  DURATION,
  EASING,
  FONT_FAMILY,
  FONT_FAMILY_COMPACT,
  FONT_SIZE,
  LOGO_COLORS,
  LINE_HEIGHT,
  RADIUS,
  SPACE,
  TARGET_MIN,
  type ColorTokens,
} from './tokens.ts';

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function colorVars(c: ColorTokens): string {
  return Object.entries(c)
    .map(([k, v]) => `--${kebab(k)}: ${v};`)
    .join('\n  ');
}

function scaleVars(scale: 'regular' | 'senior'): string {
  const sizes = Object.entries(FONT_SIZE[scale])
    .map(([k, v]) => `--font-${k}: ${v / 16}rem;`)
    .join('\n  ');
  return `${sizes}\n  --target-min: ${TARGET_MIN[scale]}px;`;
}

/**
 * The whole token sheet as CSS. Themes are attribute switches on <html>:
 * data-theme="light|dark" (absent = follow the system) and data-senior="true".
 */
export function themeCss(): string {
  const space = Object.entries(SPACE)
    .map(([k, v]) => `--space-${k}: ${v}px;`)
    .join('\n  ');
  const radius = Object.entries(RADIUS)
    .map(([k, v]) => `--radius-${k}: ${v}px;`)
    .join('\n  ');
  const duration = Object.entries(DURATION)
    .map(([k, v]) => `--duration-${k}: ${v}ms;`)
    .join('\n  ');
  return `:root {
  color-scheme: light dark;
  --font-family: ${FONT_FAMILY};
  --font-family-compact: ${FONT_FAMILY_COMPACT};
  --logo-tile: ${LOGO_COLORS.tile};
  --logo-tick: ${LOGO_COLORS.tick};
  --line-height-tight: ${LINE_HEIGHT.tight};
  --line-height-body: ${LINE_HEIGHT.body};
  ${space}
  ${radius}
  ${duration}
  --easing-standard: ${EASING.standard};
  ${scaleVars('regular')}
  ${colorVars(COLORS.light)}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
  ${colorVars(COLORS.dark)}
  }
}
:root[data-theme='dark'] {
  ${colorVars(COLORS.dark)}
}
:root[data-senior='true'] {
  ${scaleVars('senior')}
}
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-slow: 0ms;
  }
}
`;
}
