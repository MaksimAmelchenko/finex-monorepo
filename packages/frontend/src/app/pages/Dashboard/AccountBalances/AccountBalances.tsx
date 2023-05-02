import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { isToday } from 'date-fns';
import { observer } from 'mobx-react-lite';

import {
  Accordion,
  IOption,
  InlineDatePicker,
  InlineSelect,
  Option,
  bankSvg,
  coinsHandSvg,
  coinsStacked03Svg,
  cryptocurrency01Svg,
  piggyBank01Svg,
  safeSvg,
  trendUp01Svg,
  wallet03Svg,
} from '@finex/ui-kit';
import { BalanceCard } from '../../OutcomeMobile/BalanceCard/BalanceCard';
import { BalanceRepository } from '../../../stores/balance-repository';
import { DebtBalances } from '../DebtBalances/DebtBalances';
import { IMoney } from '../../../types/money';
import { Loader } from '../../../components/Loader/Loader';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { TUrl } from '../../../types';
import { formatDate, getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './AccountBalances.module.scss';

const t = getT('AccountBalances');

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
  const moneysRepository = useStore(MoneysRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const [date, setDate] = useState<Date>(new Date());
  const [selectedMoney, setSelectedMoney] = useState<IMoney | null>(null);
  const [isShowZeroBalance, setIsShowZeroBalance] = useState(false);
  const [openedAccordionIds, setOpenedAccordionIds] = useState<string[]>([]);

  const toggleAccordion = (id: string) => () => {
    if (openedAccordionIds.includes(id)) {
      setOpenedAccordionIds(openedAccordionIds.filter(openedAccordionId => openedAccordionId !== id));
    } else {
      setOpenedAccordionIds([...openedAccordionIds, id]);
    }
  };

  useEffect(() => {
    balanceRepository.fetchBalance({ moneyId: selectedMoney?.id, date }).catch(console.error);
  }, [balanceRepository, date, selectedMoney?.id, projectsRepository.currentProject]);

  const handleClickOnShowZeroBalance = () => {
    setIsShowZeroBalance(!isShowZeroBalance);
  };

  const moneysOptions: IOption[] = useMemo(() => {
    return [
      { value: 'null', label: t('in original currency') },
      ...moneysRepository.moneys.map(money => ({ value: money.id, label: money.symbol })),
    ];
  }, [moneysRepository.moneys]);

  const handleSelectMoney = (option: IOption) => {
    const money = moneysRepository.get(option.value) || null;
    setSelectedMoney(money);
  };

  const accountTypeBalances = useMemo(() => {
    // remove zero balances
    return balanceRepository.accountTypeBalances
      .map(({ accountType, balances, accountBalances }) => ({
        accountType,
        balances: isShowZeroBalance ? balances : balances.filter(({ amount }) => amount !== 0),
        accountBalances: isShowZeroBalance
          ? accountBalances
          : accountBalances
              .map(({ account, balances }) => {
                return {
                  account,
                  balances: balances.filter(({ amount }) => amount !== 0),
                };
              })
              .filter(({ balances }) => balances.length),
      }))
      .filter(({ balances }) => balances.length);
  }, [balanceRepository.accountTypeBalances, isShowZeroBalance]);

  const balanceDate = isToday(date) ? t('today') : formatDate(date.toISOString());

  return (
    <section className={clsx(styles.root)}>
      <div className={clsx(styles.root__header, styles.header)}>
        <h2 className={styles.header__title}>
          {t('Balance')}
          <div className={styles.header__date}>
            <InlineDatePicker value={date} label={balanceDate} onChange={setDate} todayButton={t('Today')} />
          </div>
        </h2>

        <div className={styles.header__options}>
          <InlineSelect
            label={moneysOptions.find(option => option.value === (selectedMoney ? selectedMoney.id : 'null'))!.label}
            options={moneysOptions}
            onChange={handleSelectMoney}
          />

          <Option
            label={isShowZeroBalance ? t('hide zero balance') : t('show zero balance')}
            onClick={handleClickOnShowZeroBalance}
          />
        </div>
      </div>

      <div className={styles.root__content}>
        {!balanceRepository.balancesLoadState.isDone() ? (
          <Loader />
        ) : (
          <>
            <BalanceCard
              icon={coinsStacked03Svg}
              title={t('Total')}
              balances={balanceRepository.totalBalance}
              className={styles.root__totalCard}
            />

            {accountTypeBalances.map(({ accountType, balances, accountBalances }) => {
              const isExpanded = openedAccordionIds.includes(accountType.id);
              return (
                <div className={styles.root__accountTypeBalancePanel} key={accountType.id}>
                  <BalanceCard
                    icon={accountTypeIconMap[accountType.id] ?? coinsStacked03Svg}
                    title={accountType.name}
                    isAccordion
                    isExpanded={isExpanded}
                    balances={balances}
                    onClick={toggleAccordion(accountType.id)}
                    className={styles.root__accountTypeBalanceCard}
                  />
                  <Accordion isExpanded={isExpanded}>
                    {accountBalances.map(({ account, balances }) => {
                      return <BalanceCard title={account.name} balances={balances} key={account.id} />;
                    })}
                  </Accordion>
                </div>
              );
            })}

            <DebtBalances />
          </>
        )}
      </div>
    </section>
  );
});
