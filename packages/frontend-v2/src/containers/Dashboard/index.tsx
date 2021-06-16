import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import { getT } from '../../lib/core/i18n';
import { AccountBalances } from './AccountBalances';
import { DebtBalances } from './DebtBalances';
import { AccountDailyBalances } from './AccountDailyBalances';

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
