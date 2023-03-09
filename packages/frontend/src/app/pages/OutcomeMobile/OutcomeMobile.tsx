import React, { useEffect } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { observer } from 'mobx-react-lite';

import { AccountBalances } from './AccountBalances/AccountBalances';
import { BalanceRepository } from '../../stores/balance-repository';
import { DebtBalances } from './DebtBalances/DebtBalances';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './OutcomeMobile.module.scss';

const t = getT('OutcomeMobile');

export const OutcomeMobile = observer(() => {
  const balanceRepository = useStore(BalanceRepository);

  useEffect(() => {
    PullToRefresh.init({
      mainElement: `.${styles.root}`,
      triggerElement: `.${styles.root}`,
      instructionsReleaseToRefresh: ' ',
      instructionsRefreshing: ' ',
      instructionsPullToRefresh: ' ',
      onRefresh() {
        balanceRepository.fetchBalance({}).catch(console.error);
      },
      shouldPullToRefresh() {
        // @ts-ignore
        return !this.mainElement.scrollTop;
      },
      refreshTimeout: 0,
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return (
    <div className={styles.root}>
      <AccountBalances />
      <DebtBalances />
    </div>
  );
});

export default OutcomeMobile;
