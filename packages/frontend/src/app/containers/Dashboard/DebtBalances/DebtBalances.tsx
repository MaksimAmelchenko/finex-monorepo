import React, { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';
import { BalanceRepository } from '../../../stores/balance-repository';

const t = getT('Dashboard');

export const DebtBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);

  const { debtBalances, balancesLoadState } = balanceRepository;

  useEffect(() => {
    balancesLoadState.isNone() && balanceRepository.fetchBalance().catch(console.error);
  }, []);

  if (balancesLoadState.isPending() && !debtBalances.length) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {debtBalances.map(({ contractor, balances }) => {
        return (
          <li key={contractor.id}>
            {contractor.name}
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
