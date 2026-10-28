import { LOCALE_NAMES, LOCALES } from '@mobywatel/brand';
import { Button } from '@mobywatel/ui';
import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';
import { resetDemo } from '../../platform/demo-state.ts';
import { updateSettings, useSettings, type ThemeChoice } from '../../platform/settings.ts';

const THEMES: readonly ThemeChoice[] = ['system', 'light', 'dark'];

const cardClass = 'm-0 rounded-lg border border-border bg-surface p-4 [&_legend]:px-1';
/** A whole row is the label, at least one touch target high. */
const choiceRowClass =
  'flex min-h-target cursor-pointer items-center gap-3 [&_input]:size-[1.5em] [&_input]:accent-accent';
const hintClass = 'mt-2 mb-0 text-sm text-text-muted';

export function SettingsScreen() {
  const t = useTranslations('settings');
  const settings = useSettings();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const seniorHint = useId();
  const languageHint = useId();
  const resetButton = useRef<HTMLButtonElement>(null);
  const confirmQuestion = useRef<HTMLParagraphElement>(null);
  const touched = useRef(false);

  // The buttons that open and cancel the confirmation unmount when pressed, so move focus
  // explicitly instead of letting it fall back to <body> (WCAG 2.4.3).
  useEffect(() => {
    if (!touched.current) {
      return;
    }
    (confirmReset ? confirmQuestion.current : resetButton.current)?.focus();
  }, [confirmReset]);

  return (
    <div className="grid gap-4">
      <h1>{t('title')}</h1>

      {/* First, so someone who can't read the current language finds it. Each name is in its own
          language and marked with lang, so screen readers pronounce it right (WCAG 3.1.2). */}
      <fieldset className={cardClass} aria-describedby={languageHint}>
        <legend>
          <h2 className="m-0">
            {t('language.title')}
            {settings.locale === 'en' ? null : (
              <span className="font-normal text-text-muted" lang="en">
                {' '}
                · Language
              </span>
            )}
          </h2>
        </legend>
        <p id={languageHint} className={hintClass}>
          {t('language.hint')}
        </p>
        {LOCALES.map((locale) => (
          <label key={locale} className={choiceRowClass}>
            <input
              type="radio"
              name="locale"
              value={locale}
              checked={settings.locale === locale}
              onChange={() => updateSettings({ locale })}
            />
            <span lang={locale}>{LOCALE_NAMES[locale]}</span>
          </label>
        ))}
      </fieldset>

      <section className={cardClass} aria-labelledby="senior-heading">
        <h2 id="senior-heading">{t('senior.title')}</h2>
        <label className={choiceRowClass}>
          <input
            type="checkbox"
            role="switch"
            checked={settings.senior}
            aria-describedby={seniorHint}
            onChange={(e) => updateSettings({ senior: e.currentTarget.checked })}
          />
          <span>{t('senior.label')}</span>
        </label>
        <p id={seniorHint} className={hintClass}>
          {t('senior.hint')}
        </p>
      </section>

      <fieldset className={cardClass}>
        <legend>
          <h2 className="m-0">{t('theme.title')}</h2>
        </legend>
        {THEMES.map((theme) => (
          <label key={theme} className={choiceRowClass}>
            <input
              type="radio"
              name="theme"
              value={theme}
              checked={settings.theme === theme}
              onChange={() => updateSettings({ theme })}
            />
            <span>{t(`theme.${theme}`)}</span>
          </label>
        ))}
      </fieldset>

      <section className={cardClass} aria-labelledby="reset-heading">
        <h2 id="reset-heading">{t('reset.title')}</h2>
        <p>{t('reset.body')}</p>
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-2 [&_p]:basis-full [&_p:focus]:outline-none">
            <p ref={confirmQuestion} tabIndex={-1}>
              <strong>{t('reset.confirmQuestion')}</strong>
            </p>
            <Button
              variant="danger"
              onClick={async () => {
                await resetDemo();
                // Back to a fresh start screen; the layout moves focus to its heading.
                void navigate(PATHS.start, { state: { demoReset: true } });
              }}
            >
              {t('reset.confirm')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                touched.current = true;
                setConfirmReset(false);
              }}
            >
              {t('reset.cancel')}
            </Button>
          </div>
        ) : (
          <Button
            ref={resetButton}
            variant="secondary"
            onClick={() => {
              touched.current = true;
              setConfirmReset(true);
            }}
          >
            {t('reset.button')}
          </Button>
        )}
      </section>
    </div>
  );
}
