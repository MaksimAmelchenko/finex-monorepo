import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import {
  Accordion,
  bankSvg,
  coinsHandSvg,
  coinsStacked03Svg,
  cryptocurrency01Svg,
  piggyBank01Svg,
  safeSvg,
  trendUp01Svg,
  wallet03Svg,
} from '@finex/ui-kit';
import { BalanceCard } from '../BalanceCard/BalanceCard';
import { BalanceRepository } from '../../../stores/balance-repository';
import { Loader } from '../../../components/Loader/Loader';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { TUrl } from '../../../types';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './AccountBalances.module.scss';

const t = getT('AccountBalancesMobile');

// 1,Cash
// 3,Current account
// 4,Deposit
// 6,Credit account
// 8,E-wallet
// 10,Savings account
// 11,Investment account
// 12,Pension account

const accountTypeIconMap: Record<string, TUrl> = {
  '1': wallet03Svg,
  '3': bankSvg,
  '4': safeSvg,
  '6': coinsHandSvg,
  '8': cryptocurrency01Svg,
  '10': piggyBank01Svg,
  '11': trendUp01Svg,
  '12': coinsStacked03Svg,
};

export const AccountBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const [openedAccordionIds, setOpenedAccordionIds] = useState<string[]>([]);

  const toggleAccordion = (id: string) => () => {
    if (openedAccordionIds.includes(id)) {
      setOpenedAccordionIds(openedAccordionIds.filter(openedAccordionId => openedAccordionId !== id));
    } else {
      setOpenedAccordionIds([...openedAccordionIds, id]);
    }
  };

  useEffect(() => {
    balanceRepository.fetchBalance({}).catch(console.error);
  }, [balanceRepository, projectsRepository.currentProject]);

  const accountTypeBalances = useMemo(() => {
    // remove zero balances
    return balanceRepository.accountTypeBalances
      .map(({ accountType, balances, accountBalances }) => ({
        accountType,
        balances: balances.filter(({ amount }) => amount !== 0),
        accountBalances: accountBalances
          .map(({ account, balances }) => {
            return {
              account,
              balances: balances.filter(({ amount }) => amount !== 0),
            };
          })
          .filter(({ balances }) => balances.length),
      }))
      .filter(({ balances }) => balances.length);
  }, [balanceRepository.accountTypeBalances]);

  if (!balanceRepository.balancesLoadState.isDone()) {
    return <Loader />;
  }

  return (
    <section className={clsx(styles.root)}>
      <header className={clsx(styles.root__header, styles.header)}>
        <h2 className={styles.header__title}>{t('Balance')}</h2>
      </header>

      <BalanceCard
        icon={coinsStacked03Svg}
        title={t('Total')}
        balances={balanceRepository.totalBalance}
        className={styles.root__totalCard}
      />

      {accountTypeBalances.map(({ accountType, balances, accountBalances }) => {
        const isExpanded = openedAccordionIds.includes(accountType.id);
        return (
          <div className={styles.balancePanel} onClick={toggleAccordion(accountType.id)} key={accountType.id}>
            <BalanceCard
              icon={accountTypeIconMap[accountType.id] ?? coinsStacked03Svg}
              title={accountType.name}
              isAccordion
              isExpanded={isExpanded}
              balances={balances}
            />
            <Accordion isExpanded={isExpanded}>
              {accountBalances.map(({ account, balances }) => {
                return <BalanceCard title={account.name} balances={balances} key={account.id} />;
              })}
            </Accordion>
          </div>
        );
      })}
    </section>
  );
});
