import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { isToday } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { BalanceRepository } from '../../../stores/balance-repository';
import { BalancesTable } from '../BalancesTable/BalancesTable';
import { CircularIndeterminate, InlineDatePicker, InlineSelect, IOption, Option } from '@finex/ui-kit';
import { IMoney } from '../../../types/money';
import { MoneysRepository } from '../../../stores/moneys-repository';
import { formatDate, getT, toCurrency } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './AccountBalances.module.scss';

const t = getT('AccountBalances');

export const AccountBalances = observer(() => {
  const balanceRepository = useStore(BalanceRepository);
  const moneysRepository = useStore(MoneysRepository);

  const [date, setDate] = useState<Date>(new Date());
  const [selectedMoney, setSelectedMoney] = useState<IMoney | null>(null);
  const [isShowZeroBalance, setIsShowZeroBalance] = useState(false);

  useEffect(() => {
    balanceRepository.fetchBalance({ moneyId: selectedMoney?.id, date }).catch(console.error);
  }, [balanceRepository, date, selectedMoney?.id]);

  const handleClickOnShowZeroBalance = () => {
    setIsShowZeroBalance(!isShowZeroBalance);
  };

  const moneysOptions: IOption[] = useMemo(() => {
    return [
      { value: 'null', title: t('in original currency') },
      ...moneysRepository.moneys.map(money => ({ value: money.id, title: money.symbol })),
    ];
  }, [moneysRepository.moneys]);

  const handleSelectMoney = (moneyId: string) => {
    const money = moneysRepository.get(moneyId) || null;
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
              label={moneysOptions.find(option => option.value === (selectedMoney?.id || 'null'))!.title}
              options={moneysOptions}
              onSelect={handleSelectMoney}
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
            <table className={clsx('table table_condensed')}>
              <tbody>
                {balanceRepository.totalBalance.map(({ money, amount }, index, array) => (
                  <tr className={clsx(styles.row)} key={money.id}>
                    {index === 0 && (
                      <td rowSpan={array.length} className={clsx(styles.row__firstCell)}>
                        {t('Total')}
                      </td>
                    )}
                    <td align="right" className="minWidth numeric">
                      {toCurrency(amount, money.precision)}
                    </td>
                    <td
                      align="left"
                      className={clsx('minWidth', styles.row__currency_symbol, styles.row__lastCell)}
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
