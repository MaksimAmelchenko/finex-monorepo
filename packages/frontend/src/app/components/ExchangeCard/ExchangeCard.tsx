import React from 'react';
import clsx from 'clsx';

import { toCurrency } from '../../lib/core/i18n';

import { refreshCW03Svg } from '@finex/ui-kit';

import styles from './ExchangeCard.module.scss';

interface ExchangeCardCardOperationExchange {
  id: string;
  accountSell: {
    name: string;
  };
  amountSell: number;
  moneySell: {
    name: string;
    symbol: string;
    precision?: number;
  };

  accountBuy: {
    name: string;
  };
  amountBuy: number;
  moneyBuy: {
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
export interface ExchangeCardProps {
  exchange: ExchangeCardCardOperationExchange;
  isHighlighted: boolean;
  onClick: (exchangeId: string) => void;
}

export function ExchangeCard({ exchange, isHighlighted, onClick }: ExchangeCardProps) {
  const { id, accountSell, amountSell, moneySell, accountBuy, amountBuy, moneyBuy, fee, moneyFee, accountFee, note } =
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
            <div className={styles.mainContent__accountName}>{accountBuy.name}</div>
            <div className={styles.mainContent__amount}>
              +{toCurrency(amountBuy, { unit: moneyBuy.symbol, precision: moneyBuy.precision })}
            </div>
          </div>

          <div className={styles.mainContent__header}>
            <div className={styles.mainContent__accountName}>{accountSell.name}</div>
            <div className={styles.mainContent__amount}>
              {toCurrency(-amountSell, { unit: moneySell.symbol, precision: moneySell.precision })}
            </div>
          </div>

          {fee && accountFee && moneyFee && (
            <div className={styles.mainContent__header}>
              <div className={clsx(styles.mainContent__accountName, styles.mainContent__accountName_fee)}>
                {accountFee.name}
              </div>
              <div className={clsx(styles.mainContent__amount, styles.mainContent__amount_fee)}>
                {toCurrency(-fee, { unit: moneyFee.symbol, precision: moneyFee.precision })}
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
