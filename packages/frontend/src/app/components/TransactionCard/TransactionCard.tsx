import React from 'react';
import clsx from 'clsx';

import { getT, toCurrency } from '../../lib/core/i18n';

import { miscellaneousSvg } from '@finex/ui-kit';

import styles from './TransactionCard.module.scss';

interface TransactionCardOperationTransaction {
  id: string;
  category: {
    fullPath: (isIncludeOwnName: boolean) => string;
  } | null;
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

export interface TransactionCardProps {
  transaction: TransactionCardOperationTransaction;
  isHighlighted?: boolean;
  onClick: (transactionId: string) => void;
}

const t = getT('TransactionCard');

export function TransactionCard({ transaction, isHighlighted, onClick }: TransactionCardProps) {
  const { id, category, account, sign, amount, money, note } = transaction;
  const handleClick = () => {
    onClick(id);
  };

  return (
    <button
      type="button"
      className={clsx(styles.root, isHighlighted && styles.root_isHighlighted)}
      onClick={handleClick}
    >
      <div className={clsx(styles.root__icon, styles.icon)}>
        <img src={miscellaneousSvg} loading="lazy" alt="Transaction logo" />
      </div>
      <div className={styles.root__contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.mainContent__header}>
            {category ? (
              <div className={styles.mainContent__categoryName}>{category.fullPath(true)}</div>
            ) : (
              <div className={clsx(styles.mainContent__categoryName, styles.mainContent__categoryName_uncategorized)}>
                {t('Uncategorized')}
              </div>
            )}
            <div className={clsx(styles.mainContent__amount, sign === 1 && styles.mainContent__amount_income)}>
              {sign === 1 ? '+' : ''}
              {toCurrency(amount, { unit: money.symbol, precision: money.precision })}
            </div>
          </div>
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
