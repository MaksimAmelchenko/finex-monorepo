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
    amountSell,
    moneySell,
    amountBuy,
    moneyBuy,
    accountSell,
    accountBuy,
    fee,
    moneyFee,
    accountFee,
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
        <div>{accountSell.name}</div>
      </td>
      <td>
        <div>{accountBuy.name}</div>
      </td>

      <td className="text-end numeric">
        <div>{toCurrency(amountSell, moneySell.precision)}</div>
      </td>

      <td className="currency">
        <div dangerouslySetInnerHTML={{ __html: moneySell.symbol }} />
      </td>

      <td className="text-end numeric">
        <div>{toCurrency(amountBuy, moneyBuy.precision)}</div>
      </td>

      <td className="currency">
        <div dangerouslySetInnerHTML={{ __html: moneyBuy.symbol }} />
      </td>

      <td className="text-end numeric">
        <div>
          {amountBuy > amountSell
            ? toCurrency(amountBuy / amountSell, moneyBuy.precision)
            : toCurrency(amountSell / amountBuy, moneySell.precision)}
        </div>
      </td>

      <td className="text-end numeric">{fee && moneyFee && <div>{toCurrency(fee, moneyFee.precision)}</div>}</td>

      <td className="currency">{moneyFee && <div dangerouslySetInnerHTML={{ __html: moneyFee.symbol }} />}</td>

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
