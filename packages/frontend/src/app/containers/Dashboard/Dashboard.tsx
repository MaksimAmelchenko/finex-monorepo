import React from 'react';
import { observer } from 'mobx-react-lite';

import { AccountBalances } from './AccountBalances/AccountBalances';
import { AccountDailyBalances } from './AccountDailyBalances/AccountDailyBalances';
import { DebtBalances } from './DebtBalances/DebtBalances';
import { getT } from '../../lib/core/i18n';

const t = getT('Dashboard');

export const Dashboard = observer(() => {
  return (
    <article>
      <AccountDailyBalances />
      <hr />
      <AccountBalances />
      <hr />
      <DebtBalances />
    </article>
  );
});

export default Dashboard;
