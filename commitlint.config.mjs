export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        'pwa',
        'ui',
        'brand',
        'core',
        'assistant',
        'services',
        'a11y',
        'i18n',
        'e2e',
        'claude',
        'tooling',
        'docs',
        'release',
      ],
    ],
  },
};
