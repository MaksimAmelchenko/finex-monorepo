import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppBar } from '../../components/AppBar/AppBar';
import { getT } from '../../lib/core/i18n';

import styles from './PlanningMobile.module.scss';

import programmerIllustrationSvg from './assets/programmer-rafiki.svg';

const t = getT('PlanningMobile');

export const PlanningMobile = observer(() => {
  return (
    <div className={styles.layout}>
      <AppBar title={t('Planning')} />
      <main className={styles.main}>
        <span className={styles.main__text}>{t('Coming soon')}</span>
        <div className={styles.main__illustration}>
          <img src={programmerIllustrationSvg} alt="Programmer" />
        </div>
        <a href="https://storyset.com/technology" className={styles.main__illustrationAttribution}>
          Technology illustrations by Storyset
        </a>
      </main>
    </div>
  );
});

export default PlanningMobile;
