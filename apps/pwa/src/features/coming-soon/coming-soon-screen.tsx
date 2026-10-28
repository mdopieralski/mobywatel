import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

import { PATHS } from '../../app/paths.ts';

export type ComingSoon = 'inbox' | 'notifications' | 'assistant';

/** A header shortcut whose feature isn't built yet: says what will be here, never a dead end. */
export function ComingSoonScreen({ screen }: { screen: ComingSoon }) {
  const t = useTranslations('soon');
  return (
    <div className="grid justify-items-start gap-3 [&_h1]:m-0 [&_p]:m-0">
      <h1>{t(`${screen}.title`)}</h1>
      <p className="rounded-pill bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">{t('badge')}</p>
      <p>{t(`${screen}.body`)}</p>
      <Link className="inline-flex min-h-target items-center font-semibold" to={PATHS.start}>
        {t('back')}
      </Link>
    </div>
  );
}
