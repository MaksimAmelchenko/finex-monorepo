import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { PlanTransaction } from '../../../../stores/models/plan-transaction';
import { SelectableDateCell } from '../../../../components/SelectableDateCell/SelectableDateCell';
import { toCurrency } from '../../../../lib/core/i18n';

import styles from './PlanTransactionRow.module.scss';

interface PlanTransactionRowProps {
  planTransaction: PlanTransaction;
  onClick: (planTransaction: PlanTransaction) => void;
}

export const PlanTransactionRow = observer<PlanTransactionRowProps>(({ planTransaction, onClick }) => {
  const {
    account,
    contractor,
    category,
    sign,
    amount,
    money,
    plan: {
      //
      startDate,
      note,
      markerColor,
      schedule,
    },
    isSelected,
    isDeleting,
  } = planTransaction;

  const handleOnSelect = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    planTransaction.toggleSelection();
  };

  const handleClick = (event: React.SyntheticEvent) => {
    onClick(planTransaction);
  };

  return (
    <tr onClick={handleClick} className={clsx(styles.row, isDeleting && styles.row_is_deleting)}>
      <SelectableDateCell
        date={startDate}
        isSelected={isSelected}
        markerColor={markerColor}
        onSelect={handleOnSelect}
      />

      <td>
        <div>{account.name}</div>
        <div>{contractor?.name}</div>
      </td>

      <td>
        <div>{category.name}</div>
        <div className={styles.categoryPath}>{category.fullPath()}</div>
      </td>

      <td className="text-end  numeric">
        {toCurrency(sign * amount, { unit: money.symbol, precision: money.precision })}
      </td>

      <td dangerouslySetInnerHTML={{ __html: schedule }} />

      <td className="hidden-sm min-width">{note}</td>
    </tr>
  );
});
