import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BalanceRepository } from '../../../stores/balance-repository';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

const t = getT('Dashboard');

export const AccountBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);

  const { accountBalances, balancesLoadState } = balanceRepository;

  useEffect(() => {
    balanceRepository.fetchBalance().catch(console.error);
  }, []);

  if (balancesLoadState.isPending() && !accountBalances.length) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {accountBalances.map(({ account, balances }) => {
        return (
          <li key={account.id}>
            {account.name}
            <ul>
              {balances.map(({ money, sum }) => {
                return (
                  <li key={money.id}>
                    {money.name} - {sum}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
});
