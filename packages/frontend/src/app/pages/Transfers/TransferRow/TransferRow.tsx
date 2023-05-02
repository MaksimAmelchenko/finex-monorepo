import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox, Tag } from '@finex/ui-kit';
import { Transfer } from '../../../stores/models/transfer';
import { formatDate, toCurrency } from '../../../lib/core/i18n';

import styles from './TransferRow.module.scss';

interface TransferRowProps {
  transfer: Transfer;
  onClick: (transfer: Transfer) => void;
}

export const TransferRow = observer<TransferRowProps>(({ transfer, onClick }) => {
  const { amount, money, accountFrom, accountTo, fee, moneyFee, transferDate, isDeleting, isSelected, note, tags } =
    transfer;

  const handleOnSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    transfer.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(transfer);
  };

  return (
    <tr onClick={handleClick} className={clsx(styles.row, isDeleting && styles.row_is_deleting)}>
      <td className={clsx(styles.firstColumn, 'min-width')}>
        <div className={clsx(styles.dateColumn)} onClick={handleOnSelect}>
          <div className={clsx(styles.dateColumn__colorMark)} />
          <BaseCheckbox value={isSelected} />
          <div className={styles.dateColumn__dateContainer}>
            <div className={styles.dateColumn__date}>{formatDate(transferDate)}</div>
          </div>
        </div>
      </td>

      <td>
        <div>{accountFrom.name}</div>
      </td>
      <td>
        <div>{accountTo.name}</div>
      </td>

      <td className="text-end numeric">
        <div>{toCurrency(amount, { unit: money.symbol, precision: money.precision })}</div>
      </td>

      <td className="text-end numeric">
        {fee && moneyFee && <div>{toCurrency(fee, { unit: moneyFee.symbol, precision: moneyFee.precision })}</div>}
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
