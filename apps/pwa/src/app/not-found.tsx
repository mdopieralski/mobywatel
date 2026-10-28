import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from './paths.ts';

export function NotFound() {
  const t = useTranslations('common.notFound');
  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('body')}</p>
      {/* A 48 px target, like the back links on the other screens. */}
      <Link className="inline-flex items-center gap-2 min-h-target font-semibold" to={PATHS.start}>
        <span aria-hidden="true">←</span> {t('back')}
      </Link>
    </>
  );
}
