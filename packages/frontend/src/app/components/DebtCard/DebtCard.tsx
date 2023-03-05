import React from 'react';
import clsx from 'clsx';

import { toCurrency } from '../../lib/core/i18n';

interface DebtCardOperationDebt {
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

export interface DebtCardProps {
  debtItem: DebtCardOperationDebt;
  onClick: (debtItemId: string) => void;
}

import { gift01Svg } from '@finex/ui-kit';

import styles from './DebtCard.module.scss';

export function DebtCard({ debtItem, onClick }: DebtCardProps) {
  const { id, contractor, category, account, sign, amount, money, note } = debtItem;
  const handleClick = () => {
    onClick(id);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={clsx(styles.root__icon, styles.icon)}>
        <img src={gift01Svg} loading="lazy" />
      </div>
      <div className={styles.root__contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.mainContent__header}>
            <div className={styles.mainContent__contractorName}>{contractor.name}</div>
            <div className={clsx(styles.mainContent__amount, sign === 1 && styles.mainContent__amount_income)}>
              {toCurrency(sign * amount, money.precision)} <span dangerouslySetInnerHTML={{ __html: money.symbol }} />
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
