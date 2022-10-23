import React from 'react';
import { observer } from 'mobx-react-lite';

import { AccountBalances } from './AccountBalances/AccountBalances';
import { AccountDailyBalances } from './AccountDailyBalances/AccountDailyBalances';
import { DebtBalances } from './DebtBalances/DebtBalances';
import { getT } from '../../lib/core/i18n';

import styles from './Dashboard.module.scss';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';

const t = getT('Dashboard');

export const Dashboard = observer(() => {
  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Outcome')} />
      <article className={styles.dashboard}>
        <div style={{ overflow: 'auto', minWidth: '40rem' }}>
          <AccountBalances />
        </div>
        <div style={{ overflow: 'auto', minWidth: '40rem' }}>
          <AccountDailyBalances />
        </div>
      </article>
    </div>
  );
});

export default Dashboard;
