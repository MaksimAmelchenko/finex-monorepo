import React from 'react';
import { observer } from 'mobx-react-lite';

import { AccountBalances } from './AccountBalances/AccountBalances';
import { AccountDailyBalances } from './AccountDailyBalances/AccountDailyBalances';
import { DebtBalances } from './DebtBalances/DebtBalances';
import { getT } from '../../lib/core/i18n';

import styles from './Dashboard.module.scss';

const t = getT('Dashboard');

export const Dashboard = observer(() => {
  return (
    <article className={styles.dashboard}>
      <div>
        <AccountBalances />
        <DebtBalances />
      </div>
      <AccountDailyBalances />
    </article>
  );
});

export default Dashboard;
