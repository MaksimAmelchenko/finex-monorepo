import React from 'react';
import clsx from 'clsx';

import { TUrl } from '../../../types';
import { ChevronRightIcon, chevronRightSvg } from '@finex/ui-kit';
import { toCurrency } from '../../../lib/core/i18n';

import styles from './BalanceCard.module.scss';

interface IMoneyLike {
  id: string;
  symbol: string;
  precision?: number;
}

interface IBalance {
  amount: number;
  money: IMoneyLike;
}

export interface BalanceCardProps {
  icon?: TUrl;
  title: string;
  balances: IBalance[];
  isAccordion?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BalanceCard({
  icon,
  title,
  balances,
  isAccordion = false,
  isExpanded = false,
  onClick,
  className,
}: BalanceCardProps): JSX.Element {
  return (
    <button type="button" className={clsx(styles.root, className)} onClick={onClick}>
      {icon && <img src={icon} className={clsx(styles.root__icon, styles.icon)} loading="lazy" />}
      <div className={clsx(styles.root__header, styles.header)}>
        <div className={styles.header__title}>{title}</div>
        {isAccordion && (
          <ChevronRightIcon
            className={clsx(styles.header__expandIcon, isExpanded && styles.header__expandIcon_expended)}
          />
        )}
      </div>
      <div className={styles.root__amounts}>
        {balances.length > 0 ? (
          balances.map(({ amount, money }) => {
            return (
              <div
                className={clsx(styles.root__amount, Math.sign(amount) === -1 && styles.root__amount_minus)}
                key={money.id}
              >
                {toCurrency(amount, money.precision)} <span dangerouslySetInnerHTML={{ __html: money.symbol }} />
              </div>
            );
          })
        ) : (
          <div className={clsx(styles.root__amount, styles.root__amount_zero)}>0</div>
        )}
      </div>
    </button>
  );
}
