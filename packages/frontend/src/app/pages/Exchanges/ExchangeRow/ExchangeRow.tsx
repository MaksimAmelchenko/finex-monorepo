import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox, Tag } from '@finex/ui-kit';
import { Exchange } from '../../../stores/models/exchange';
import { formatDate, toCurrency } from '../../../lib/core/i18n';

import styles from './ExchangeRow.module.scss';

interface ExchangeRowProps {
  exchange: Exchange;
  onClick: (exchange: Exchange) => void;
}

export const ExchangeRow = observer<ExchangeRowProps>(({ exchange, onClick }) => {
  const {
    sellAmount,
    sellMoney,
    buyAmount,
    buyMoney,
    sellAccount,
    buyAccount,
    fee,
    feeMoney,
    feeAccount,
    exchangeDate,
    isDeleting,
    isSelected,
    note,
    tags,
  } = exchange;

  const handleOnSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    exchange.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(exchange);
  };

  return (
    <tr onClick={handleClick} className={clsx(styles.row, isDeleting && styles.row_is_deleting)}>
      <td className={clsx(styles.firstColumn, 'min-width')}>
        <div className={clsx(styles.dateColumn)} onClick={handleOnSelect}>
          <div className={clsx(styles.dateColumn__colorMark)} />
          <BaseCheckbox value={isSelected} />
          <div className={styles.dateColumn__dateContainer}>
            <div className={styles.dateColumn__date}>{formatDate(exchangeDate)}</div>
          </div>
        </div>
      </td>

      <td>
        <div>{sellAccount.name}</div>
      </td>
      <td>
        <div>{buyAccount.name}</div>
      </td>

      <td className="text-end numeric">
        <div>{toCurrency(sellAmount, { unit: sellMoney.symbol, precision: sellMoney.precision })}</div>
      </td>

      <td className="text-end numeric">
        <div>{toCurrency(buyAmount, { unit: buyMoney.symbol, precision: buyMoney.precision })}</div>
      </td>

      <td className="text-end numeric">
        <div>
          {buyAmount > sellAmount
            ? toCurrency(buyAmount / sellAmount, { unit: buyMoney.symbol, precision: buyMoney.precision })
            : toCurrency(sellAmount / buyAmount, { unit: sellMoney.symbol, precision: sellMoney.precision })}
        </div>
      </td>

      <td className="text-end numeric">
        {fee && feeMoney && <div>{toCurrency(fee, { unit: feeMoney.symbol, precision: feeMoney.precision })}</div>}
      </td>

      <td className="hidden-sm min-width">{note}</td>
      <td className="hidden-sm min-width">
        <div className={styles.tags}>
          {tags.map(tag => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </div>
      </td>
    </tr>
  );
});
