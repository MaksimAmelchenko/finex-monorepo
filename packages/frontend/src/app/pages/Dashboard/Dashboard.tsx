import React from 'react';
import { observer } from 'mobx-react-lite';

import { AccountBalances } from './AccountBalances/AccountBalances';
import { AccountDailyBalances } from './AccountDailyBalances/AccountDailyBalances';
import { DebtBalances } from './DebtBalances/DebtBalances';
import { getT } from '../../lib/core/i18n';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';

import styles from './Dashboard.module.scss';

const t = getT('Dashboard');

export const Dashboard = observer(() => {
  return (
    <div className={styles.root}>
      <HeaderLayout title={t('Outcome')} data-cy="outcome-header" />
      <main className={styles.root__dashboard}>
        <div className={styles.root__balances}>
          <AccountBalances />

          <DebtBalances />
        </div>
        <div className={styles.root__charts}>
          <AccountDailyBalances />
        </div>
      </main>
    </div>
  );
});

export default Dashboard;
