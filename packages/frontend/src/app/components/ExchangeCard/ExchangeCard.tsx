import React from 'react';
import clsx from 'clsx';

import { toCurrency } from '../../lib/core/i18n';

import { refreshCW03Svg } from '@finex/ui-kit';

import styles from './ExchangeCard.module.scss';

interface ExchangeCardCardOperationExchange {
  id: string;
  sellAccount: {
    name: string;
  };
  sellAmount: number;
  sellMoney: {
    name: string;
    symbol: string;
    precision?: number;
  };

  buyAccount: {
    name: string;
  };
  buyAmount: number;
  buyMoney: {
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
export interface ExchangeCardProps {
  exchange: ExchangeCardCardOperationExchange;
  isHighlighted: boolean;
  onClick: (exchangeId: string) => void;
}

export function ExchangeCard({ exchange, isHighlighted, onClick }: ExchangeCardProps) {
  const { id, sellAccount, sellAmount, sellMoney, buyAccount, buyAmount, buyMoney, fee, feeMoney, feeAccount, note } =
    exchange;

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
        <img src={refreshCW03Svg} loading="lazy" alt="Exchange logo" />
      </div>
      <div className={styles.root__contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.mainContent__header}>
            <div className={styles.mainContent__accountName}>{buyAccount.name}</div>
            <div className={styles.mainContent__amount}>
              +{toCurrency(buyAmount, { unit: buyMoney.symbol, precision: buyMoney.precision })}
            </div>
          </div>

          <div className={styles.mainContent__header}>
            <div className={styles.mainContent__accountName}>{sellAccount.name}</div>
            <div className={styles.mainContent__amount}>
              {toCurrency(-sellAmount, { unit: sellMoney.symbol, precision: sellMoney.precision })}
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
