import { Disclaimer } from '@mobywatel/ui';
import { useTranslations } from 'use-intl';

import { PATHS } from './paths.ts';

// Replaces React Router's English developer screen. A juror who hits a bug still sees Polish,
// the disclaimer and a way back. Plain <a> (full reload) because the router may be broken.
export function RouteError() {
  const t = useTranslations('common.error');
  return (
    <main className="max-w-[30rem] mx-auto pt-[calc(env(safe-area-inset-top)_+_var(--space-6))] px-4 pb-6">
      <h1>{t('title')}</h1>
      <p>{t('body')}</p>
      <p>
        <a className="inline-flex items-center min-h-target font-semibold" href={PATHS.start}>
          {t('back')}
        </a>
      </p>
      <Disclaimer variant="inline" />
    </main>
  );
}
