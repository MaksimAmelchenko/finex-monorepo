import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { isToday } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { BalanceRepository } from '../../../stores/balance-repository';
import { BalancesTable } from '../BalancesTable/BalancesTable';
import { CircularIndeterminate, InlineDatePicker, InlineSelect, IOption, Option } from '@finex/ui-kit';
import { IMoney } from '../../../types/money';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { formatDate, getT, toCurrency } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './AccountBalances.module.scss';

const t = getT('AccountBalances');

export const AccountBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);
  const moneysRepository = useStore(MoneysRepository);
  const projectsRepository = useStore(ProjectsRepository);

  const [date, setDate] = useState<Date>(new Date());
  const [selectedMoney, setSelectedMoney] = useState<IMoney | null>(null);
  const [isShowZeroBalance, setIsShowZeroBalance] = useState(false);

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

  const treeBalance = isShowZeroBalance
    ? balanceRepository.treeBalance
    : balanceRepository.treeBalance
        .map(balance => ({
          ...balance,
          balances: balance.balances.filter(({ amount }) => amount !== 0),
        }))
        .filter(({ balances }) => balances.length);

  const balanceDate = isToday(date) ? t('today') : formatDate(date.toISOString());

  return (
    <div>
      <section className={clsx(styles.accountBalances)}>
        <div className={clsx(styles.accountBalances__header, styles.header)}>
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

        {!balanceRepository.balancesLoadState.isDone() ? (
          <div className={styles.loader}>
            <CircularIndeterminate />
          </div>
        ) : (
          <>
            <table className="table table-borderless table-sm">
              <tbody>
                {balanceRepository.totalBalance.map(({ money, amount }, index, array) => (
                  <tr className={clsx(styles.row)} key={money.id}>
                    {index === 0 && (
                      <td rowSpan={array.length} className={clsx(styles.row__firstCell)}>
                        {t('Total')}
                      </td>
                    )}
                    <td align="right" className="min-width numeric">
                      {toCurrency(amount, money.precision)}
                    </td>
                    <td
                      align="left"
                      className={clsx('min-width currency', styles.row__currency_symbol, styles.row__lastCell)}
                      dangerouslySetInnerHTML={{ __html: money.symbol }}
                    />
                  </tr>
                ))}
              </tbody>
            </table>

            <BalancesTable treeBalance={[...treeBalance, ...balanceRepository.treeDebt]} />
          </>
        )}
      </section>
    </div>
  );
});
