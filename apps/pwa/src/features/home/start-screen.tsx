import { Disclaimer } from '@mobywatel/ui';
import { useLocation } from 'react-router';
import { useTranslations } from 'use-intl';

import { useAppLocale } from '../../platform/i18n.ts';
import { CategoryStack } from '../categories/category-stack.tsx';
import { ReminderTile } from '../reminders/reminder-tile.tsx';
import { AskBar } from './ask-bar.tsx';
import styles from './start-screen.module.css';

// Start screen, modelled on the reference's: the category stack (documents live inside), the most urgent matter, "what do you
// need?". Our own artwork and the disclaimer (prototype-guardrails skill).
export function StartScreen() {
  const t = useTranslations('home');
  const tc = useTranslations('categories');
  const locale = useAppLocale();
  const demoReset = (useLocation().state as { demoReset?: boolean } | null)?.demoReset === true;
  return (
    <div className={styles.stack}>
      <p role="status" className={demoReset ? styles.notice : styles.empty}>
        {demoReset ? t('demoReset') : ''}
      </p>
      <h1 className={styles.title}>{tc('title')}</h1>
      <CategoryStack />
      <ReminderTile />
      <Disclaimer variant="inline" locale={locale} />
      <div className={styles.dock}>
        <AskBar />
      </div>
    </div>
  );
}
