import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { BaseCheckbox, Tag } from '@finex/ui-kit';
import { CashFlowItem } from '../../../stores/models/cash-flow-item';
import { formatDate, getT, toCurrency } from '../../../lib/core/i18n';

import styles from './CashFlowItemRow.module.scss';

interface CashFlowItemRowProps {
  cashFlowItem: CashFlowItem;
  onClick: (debtItem: CashFlowItem) => void;
}

const t = getT('CashFlowItemRow');

export const CashFlowItemRow = observer<CashFlowItemRowProps>(({ cashFlowItem, onClick }) => {
  const {
    cashFlowItemDate,
    account,
    category,
    sign,
    amount,
    money,
    quantity,
    unit,
    note,
    tags,
    isSelected,
    isDeleting,
  } = cashFlowItem;

  const handleOnSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    cashFlowItem.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(cashFlowItem);
  };

  return (
    <tr onClick={handleClick} className={clsx(styles.row, isDeleting && styles.row_is_deleting)}>
      <td className={clsx(styles.firstColumn, 'min-width')}>
        <div className={clsx(styles.dateColumn)} onClick={handleOnSelect}>
          <div className={clsx(styles.dateColumn__colorMark)} />
          <BaseCheckbox value={isSelected} />
          <div className={styles.dateColumn__dateContainer}>
            <div className={styles.dateColumn__date}>{formatDate(cashFlowItemDate)}</div>
          </div>
        </div>
      </td>

      <td>
        <div>{account.name}</div>
      </td>

      {category ? (
        <td>
          <div>{category.name}</div>
          <div className={styles.categoryPath}>{category.fullPath()}</div>
        </td>
      ) : (
        <td>
          <div>{t('Uncategorized')}</div>
        </td>
      )}

      <td>
        {quantity}
        {unit && ` ${unit.name}`}
      </td>

      {sign === 1 ? (
        <td className="text-end numeric">{toCurrency(amount, { unit: money.symbol, precision: money.precision })}</td>
      ) : (
        <td />
      )}

      {sign === -1 ? (
        <td className="text-end numeric">{toCurrency(-amount, { unit: money.symbol, precision: money.precision })}</td>
      ) : (
        <td />
      )}

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
