import React from 'react';
import clsx from 'clsx';

import { toCurrency } from '../../lib/core/i18n';

import { coinsHandSvg } from '@finex/ui-kit';

import styles from './DebtItemCard.module.scss';

interface DebtItemCardOperationDebt {
  id: string;
  contractor: {
    name: string;
  };
  category: {
    name: string;
    fullPath: (isIncludeOwnName: boolean) => string;
  };
  account: {
    name: string;
  };
  sign: number;
  amount: number;
  money: {
    name: string;
    symbol: string;
    precision?: number;
  };
  note: string;
}

export interface DebtItemCardProps {
  debtItem: DebtItemCardOperationDebt;
  onClick: (debtItemId: string) => void;
}

export function DebtItemCard({ debtItem, onClick }: DebtItemCardProps) {
  const { id, contractor, category, account, sign, amount, money, note } = debtItem;
  const handleClick = () => {
    onClick(id);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={clsx(styles.root__icon, styles.icon)}>
        <img src={coinsHandSvg} loading="lazy" alt="debt logo" />
      </div>
      <div className={styles.root__contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.mainContent__header}>
            <div className={styles.mainContent__contractorName}>{contractor.name}</div>
            <div className={clsx(styles.mainContent__amount, sign === 1 && styles.mainContent__amount_income)}>
              {toCurrency(sign * amount, { unit: money.symbol, precision: money.precision })}
            </div>
          </div>
          <div className={styles.mainContent__categoryName}>{category.name}</div>
          <div className={styles.mainContent__accountName}>{account.name}</div>
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
}
