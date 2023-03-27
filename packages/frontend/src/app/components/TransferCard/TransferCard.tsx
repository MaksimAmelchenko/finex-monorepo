import React from 'react';
import clsx from 'clsx';

import { toCurrency } from '../../lib/core/i18n';

import { reverseRightSvg } from '@finex/ui-kit';

import styles from './TransferCard.module.scss';

interface TransferCardOperationTransfer {
  id: string;
  accountFrom: {
    name: string;
  };
  accountTo: {
    name: string;
  };
  amount: number;
  money: {
    name: string;
    symbol: string;
    precision?: number;
  };

  fee: number | null;
  moneyFee: {
    name: string;
    symbol: string;
    precision?: number;
  } | null;
  accountFee: {
    name: string;
  } | null;

  note: string;
}
export interface TransferCardProps {
  transfer: TransferCardOperationTransfer;
  onClick: (transferId: string) => void;
}

export function TransferCard({ transfer, onClick }: TransferCardProps) {
  const { id, accountFrom, accountTo, amount, money, fee, moneyFee, accountFee, note } = transfer;
  const handleClick = () => {
    onClick(id);
  };

  return (
    <button type="button" className={styles.root} onClick={handleClick}>
      <div className={clsx(styles.root__icon, styles.icon)}>
        <img src={reverseRightSvg} loading="lazy" alt="Transfer logo" />
      </div>
      <div className={styles.root__contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.mainContent__header}>
            <div className={styles.mainContent__accountsWrapper}>
              <div className={styles.mainContent__accountName}>{accountTo.name}</div>
              <div className={styles.mainContent__accountName}>{accountFrom.name}</div>
            </div>
            <div className={styles.mainContent__amount}>
              {toCurrency(amount, money.precision)} <span dangerouslySetInnerHTML={{ __html: money.symbol }} />
            </div>
          </div>

          {fee && accountFee && moneyFee && (
            <div className={styles.mainContent__header}>
              <div className={clsx(styles.mainContent__accountName, styles.mainContent__accountName_fee)}>
                {accountFee.name}
              </div>
              <div className={clsx(styles.mainContent__amount, styles.mainContent__amount_fee)}>
                {toCurrency(-fee, moneyFee.precision)} <span dangerouslySetInnerHTML={{ __html: moneyFee.symbol }} />
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
