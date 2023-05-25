import React, { useMemo } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BalanceType } from '../../stores/models/cash-flow';
import { IBalance } from '../../types/balance';
import { MoneysRepository } from '../../stores/moneys-repository';
import { DataFlow03Icon } from '@finex/ui-kit';
import { getT, toCurrency } from '../../lib/core/i18n';
import { moneyId } from '../../types/money';
import { useStore } from '../../core/hooks/use-store';

import styles from './CashFlowCard.module.scss';

const t = getT('CashFlowCard');

interface ICashFlowLike {
  id: string;
  contractor: {
    name: string;
  } | null;
  accounts: Array<{ name: string }>;
  categories: Array<{ name: string }>;
  balance: Record<BalanceType, Record<moneyId, IBalance>>;
  note: string;
}

export interface CashFlowCardProps {
  cashFlow: ICashFlowLike;
  onClick: (debtId: string) => void;
}

export const CashFlowCard = observer<CashFlowCardProps>(({ cashFlow, onClick }) => {
  const moneysRepository = useStore(MoneysRepository);
  const { moneys } = moneysRepository;
  const { id, categories, accounts, contractor, balance, note } = cashFlow;

  const balanceTypeMap = useMemo<Record<BalanceType, string>>(() => {
    return {
      inflow: t('Cash Inflows'),
      outflow: t('Cash Outflows'),
      total: '',
    };
  }, []);

  const handleClick = () => {
    onClick(id);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={clsx(styles.root__icon, styles.icon)}>
        <DataFlow03Icon />
      </div>

      {!Object.keys(balance.total).length ? (
        <div className={styles.root__draft}>{t('Empty Cash Flow')}</div>
      ) : (
        <div className={styles.root__contentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.mainContent__header}>
              <div className={styles.mainContent__text}>
                {categories.length ? categories.map(({ name }) => name).join(', ') : t('Uncategorized')}
              </div>
              <div className={styles.mainContent__amounts}>
                {moneys.map(money => {
                  const total = balance.total[money.id];
                  if (!total) {
                    return null;
                  }
                  const { amount } = total;
                  return (
                    <div
                      className={clsx(
                        styles.mainContent__amount,
                        Math.sign(amount) === 1 && styles.mainContent__amount_income
                      )}
                      key={money.id}
                    >
                      {toCurrency(amount, { unit: money.symbol, precision: money.precision })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.mainContent__accounts}>{accounts.map(({ name }) => name).join(',')}</div>

            {contractor && <div className={styles.mainContent__contractor}>{contractor.name}</div>}

            <div className={styles.mainContent__details}>
              {Object.keys(balance.inflow).length > 0 &&
                Object.keys(balance.outflow).length > 0 &&
                (['inflow', 'outflow'] as BalanceType[]).map(balanceType => {
                  return (
                    <div className={styles.mainContent__detail} key={balanceType}>
                      <div className={styles.mainContent__text}>{balanceTypeMap[balanceType]}</div>
                      <div className={styles.mainContent__amounts}>
                        {moneys.map(({ id: moneyId }) => {
                          const balanceByMoney = balance[balanceType][moneyId];
                          if (!balanceByMoney) {
                            return null;
                          }
                          const { amount, money } = balanceByMoney;
                          return (
                            <div className={clsx(styles.mainContent__amount)} key={money.id}>
                              {toCurrency(amount, { unit: money.symbol, precision: money.precision })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {note && (
            <div className={styles.root__noteWrapper}>
              <div className={styles.note}>
                <div className={styles.note__text}> {note}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </button>
  );
});
