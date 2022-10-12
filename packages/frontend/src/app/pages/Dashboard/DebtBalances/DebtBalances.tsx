import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BalanceRepository } from '../../../stores/balance-repository';
import { BalancesTable } from '../BalancesTable/BalancesTable';
import { useStore } from '../../../core/hooks/use-store';

export const DebtBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);

  const { treeDebt, balancesLoadState } = balanceRepository;

  useEffect(() => {
    balancesLoadState.isNone() && balanceRepository.fetchBalance({}).catch(console.error);
  }, [balanceRepository, balancesLoadState]);

  if (balancesLoadState.isPending()) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <BalancesTable treeBalance={treeDebt} />
    </section>
  );
});
