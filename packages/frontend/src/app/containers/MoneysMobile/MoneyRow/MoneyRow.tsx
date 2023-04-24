import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Money } from '../../../stores/models/money';

import styles from './MoneyRow.module.scss';

interface MoneyRowProps {
  money: Money;
  onClick: (money: Money, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MoneyRow = observer<MoneyRowProps>(({ money, onClick }) => {
  const { currencyCode, name, isEnabled, symbol } = money;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(money, event);
  };

  return (
    <button type="button" className={clsx(styles.root, !isEnabled && styles.root_disabled)} onClick={handleClick}>
      <div className={styles.root__content}>
        <div className={styles.root__name}>
          {name}
          {currencyCode && <span className={styles.root__currencyCode}> [{currencyCode}]</span>}
        </div>
        <div className={styles.root__symbol}>{symbol}</div>
      </div>
    </button>
  );
});
