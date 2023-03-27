import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import {
  Accordion,
  bankSvg,
  coinsStacked03Svg,
  creditCard01Svg,
  cryptocurrency01Svg,
  gift01Svg,
  safeSvg,
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

// 1,Наличные
// 2,Карта
// 3,Банковский счет
// 4,Банковский вклад
// 5,Другое
// 6,Кредитная карта
// 7,Долг
// 8,Электронные деньги
// 9,Депозитная карта

const accountTypeIconMap: Record<string, TUrl> = {
  '1': wallet03Svg,
  '2': creditCard01Svg,
  '3': bankSvg,
  '4': safeSvg,
  '5': coinsStacked03Svg,
  '6': creditCard01Svg,
  '7': gift01Svg,
  '8': cryptocurrency01Svg,
  '9': creditCard01Svg,
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
