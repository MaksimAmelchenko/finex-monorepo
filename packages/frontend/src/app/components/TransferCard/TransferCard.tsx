import React from 'react';
import clsx from 'clsx';

import { toCurrency } from '../../lib/core/i18n';

import { reverseRightSvg } from '@finex/ui-kit';

import styles from './TransferCard.module.scss';

interface TransferCardOperationTransfer {
  id: string;
  fromAccount: {
    name: string;
  };
  toAccount: {
    name: string;
  };
  amount: number;
  money: {
    name: string;
    symbol: string;
    precision?: number;
  };

  fee: number | null;
  feeMoney: {
    name: string;
    symbol: string;
    precision?: number;
  } | null;
  feeAccount: {
    name: string;
  } | null;

  note: string;
}
export interface TransferCardProps {
  transfer: TransferCardOperationTransfer;
  isHighlighted: boolean;
  onClick: (transferId: string) => void;
}

export function TransferCard({ transfer, isHighlighted, onClick }: TransferCardProps) {
  const { id, fromAccount, toAccount, amount, money, fee, feeMoney, feeAccount, note } = transfer;
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
        <img src={reverseRightSvg} loading="lazy" alt="Transfer logo" />
      </div>
      <div className={styles.root__contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.mainContent__header}>
            <div className={styles.mainContent__accountsWrapper}>
              <div className={styles.mainContent__accountName}>{toAccount.name}</div>
              <div className={styles.mainContent__accountName}>{fromAccount.name}</div>
            </div>
            <div className={styles.mainContent__amount}>
              {toCurrency(amount, { unit: money.symbol, precision: money.precision })}
            </div>
          </div>

          {fee && feeAccount && feeMoney && (
            <div className={styles.mainContent__header}>
              <div className={clsx(styles.mainContent__accountName, styles.mainContent__accountName_fee)}>
                {feeAccount.name}
              </div>
              <div className={clsx(styles.mainContent__amount, styles.mainContent__amount_fee)}>
                {toCurrency(-fee, { unit: feeMoney.symbol, precision: feeMoney.precision })}
              </div>
            </div>
          )}
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
