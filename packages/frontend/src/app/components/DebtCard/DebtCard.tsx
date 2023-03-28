import React, { useMemo } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BalanceType } from '../../stores/models/debt';
import { IBalance } from '../../types/balance';
import { MoneysRepository } from '../../stores/moneys-repository';
import { getT, toCurrency } from '../../lib/core/i18n';
import { moneyId } from '../../types/money';
import { useStore } from '../../core/hooks/use-store';

import styles from './DebtCard.module.scss';

const t = getT('DebtCard');

interface IDebtLike {
  id: string;
  contractor: {
    name: string;
  };
  balance: Record<BalanceType, Record<moneyId, IBalance>>;
  note: string;
}

export interface DebtCardProps {
  debt: IDebtLike;
  onClick: (debtId: string) => void;
}

export const DebtCard = observer<DebtCardProps>(({ debt, onClick }) => {
  const moneysRepository = useStore(MoneysRepository);
  const { moneys } = moneysRepository;
  const { id, contractor, balance, note } = debt;

  const balanceTypeMap = useMemo<Record<BalanceType, string>>(() => {
    return {
      debt: t('Loan amount'),
      paidDebt: t('Principal repayment'),
      unpaidDebt: t('Rest'),
      paidInterest: t('Paid Interest'),
      fee: t('Fee'),
      fine: t('Fine'),
      cost: t('Cost'),
    };
  }, []);

  const handleClick = () => {
    onClick(id);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      {/*
      <div className={clsx(styles.root__icon, styles.icon)}>
        <img src={coinsHandSvg} loading="lazy" />
      </div>
      */}
      <div className={styles.root__contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.mainContent__header}>
            <div className={styles.mainContent__text}>{contractor.name}</div>
            <div className={styles.mainContent__amounts}>
              {moneys.map(money => {
                const unpaidDebt = balance.unpaidDebt[money.id];
                if (!unpaidDebt) {
                  return null;
                }
                const { amount } = unpaidDebt;
                return (
                  <div
                    className={clsx(
                      styles.mainContent__amount,
                      Math.sign(amount) === -1 && styles.mainContent__amount_minus
                    )}
                    key={money.id}
                  >
                    {toCurrency(amount, money.precision)} <span dangerouslySetInnerHTML={{ __html: money.symbol }} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.mainContent__details}>
            {(['debt', 'paidDebt', 'paidInterest', 'fee', 'fine', 'cost'] as BalanceType[]).map(balanceType => {
              if (!Object.keys(balance[balanceType]).length) {
                return null;
              }
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
                          {toCurrency(amount, money.precision)}{' '}
                          <span dangerouslySetInnerHTML={{ __html: money.symbol }} />
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
    </button>
  );
});
