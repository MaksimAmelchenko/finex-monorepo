import React, { useEffect } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { observer } from 'mobx-react-lite';

import { AccountBalances } from './AccountBalances/AccountBalances';
import { AppBar } from '../../components/AppBar/AppBar';
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
      mainElement: `.${styles.root__main}`,
      triggerElement: `.${styles.root__main}`,
      instructionsReleaseToRefresh: ' ',
      instructionsRefreshing: ' ',
      instructionsPullToRefresh: ' ',
      onRefresh() {
        balanceRepository.fetchBalance({}).catch(console.error);
      },
      shouldPullToRefresh() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return !this.mainElement.scrollTop;
      },
      refreshTimeout: 0,
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, [balanceRepository]);

  return (
    <div className={styles.root}>
      <AppBar title={t('Outcome')} />
      <main className={styles.root__main}>
        <AccountBalances />
        <DebtBalances />
      </main>
    </div>
  );
});

export default OutcomeMobile;
