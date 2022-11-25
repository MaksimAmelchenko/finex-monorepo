import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox, Tag } from '@finex/ui-kit';
import { DebtItem } from '../../../stores/models/debt-item';
import { formatDate, toCurrency } from '../../../lib/core/i18n';

import styles from './DebtItemRow.module.scss';

interface DebtItemRowProps {
  debtItem: DebtItem;
  onClick: (debtItem: DebtItem) => void;
}

export const DebtItemRow = observer<DebtItemRowProps>(({ debtItem, onClick }) => {
  const { debtItemDate, account, category, sign, amount, money, note, tags, isSelected, isDeleting } = debtItem;

  const handleOnSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    debtItem.toggleSelection();
  };

  const handleOnClick = (event: React.SyntheticEvent) => {
    onClick(debtItem);
  };

  return (
    <tr onClick={handleOnClick} className={clsx(styles.row, isDeleting && styles.row_is_deleting)}>
      <td className={clsx(styles.firstColumn, 'min-width')}>
        <div className={clsx(styles.dateColumn)} onClick={handleOnSelect}>
          <div className={clsx(styles.dateColumn__colorMark)} />
          <BaseCheckbox value={isSelected} />
          <div className={styles.dateColumn__dateContainer}>
            <div className={styles.dateColumn__date}>{formatDate(debtItemDate)}</div>
          </div>
        </div>
      </td>

      <td>
        <div>{account.name}</div>
      </td>

      <td>
        <div>{category.name}</div>
      </td>

      <td className="text-end hidden-sm hidden-md numeric">{toCurrency(sign * amount, money.precision)}</td>
      <td className="hidden-sm hidden-md currency" dangerouslySetInnerHTML={{ __html: money.symbol }} />

      <td className="hidden-sm">{note}</td>

      <td className="hidden-sm">
        <div className={styles.tags}>
          {tags.map(tag => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </div>
      </td>
    </tr>
  );
});
