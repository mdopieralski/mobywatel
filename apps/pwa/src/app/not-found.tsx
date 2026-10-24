import { Link } from 'react-router';
import { useTranslations } from 'use-intl';

export function NotFound() {
  const t = useTranslations('common.notFound');
  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('body')}</p>
      <Link to="/">{t('back')}</Link>
    </>
  );
}
