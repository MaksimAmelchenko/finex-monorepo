import React from 'react';

import { BottomNavigationButton } from './BottomNavigationButton/BottomNavigationButton';
import { CenterBottomNavigationButton } from './CenterBottomNavigationButton/CenterBottomNavigationButton';
import { CoinsStacked01Icon, Settings02Icon, SwitchHorizontal01Icon } from '@finex/ui-kit';
import { getT } from '../../../lib/core/i18n';

import styles from './BottomNavigation.module.scss';

const t = getT('BottomNavigation');

export function BottomNavigation(): JSX.Element {
  return (
    <nav className={styles.root}>
      <BottomNavigationButton href="/outcome" label={t('Outcome')} icon={OutcomeButtonIcon} />
      <BottomNavigationButton href="/operations" label={t('Operations')} icon={SwitchHorizontal01Icon} />
      <CenterBottomNavigationButton
        onClick={() => {
          alert('Add new...');
        }}
      />
      <BottomNavigationButton href="/budget" label={t('Budget')} icon={CoinsStacked01Icon} />
      <BottomNavigationButton href="/settings" label={t('Settings')} icon={Settings02Icon} />
    </nav>
  );
}

function OutcomeButtonIcon(): JSX.Element {
  return <div className={styles.outcomeButtonIcon} />;
}
