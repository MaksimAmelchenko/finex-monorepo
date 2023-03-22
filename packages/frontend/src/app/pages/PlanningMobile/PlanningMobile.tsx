import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppBar } from '../../components/AppBar/AppBar';
import { getT } from '../../lib/core/i18n';

import { ReactComponent as ProgrammerIllustration } from './assets/programmer-rafiki.svg';

import styles from './PlanningMobile.module.scss';

const t = getT('PlanningMobile');

export const PlanningMobile = observer(() => {
  return (
    <div className={styles.layout}>
      <AppBar title={t('Planning')} />
      <main className={styles.main}>
        <span className={styles.main__text}>{t('Coming soon')}</span>
        <div className={styles.main__illustration}>
          <ProgrammerIllustration />
        </div>
        <a href="https://storyset.com/technology" className={styles.main__illustrationAttribution}>
          Technology illustrations by Storyset
        </a>
      </main>
    </div>
  );
});

export default PlanningMobile;
