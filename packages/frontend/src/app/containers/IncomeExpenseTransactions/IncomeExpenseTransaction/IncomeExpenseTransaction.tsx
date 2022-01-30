import React from 'react';
import { observer } from 'mobx-react-lite';

import { IIncomeExpenseTransaction } from '../../../types/income-expense-transaction';
import { getT } from '../../../lib/core/i18n';

const t = getT('CashFlow');

interface IIncomeExpenseTransactionProps {
  incomeExpenseTransaction: IIncomeExpenseTransaction;
}

export const IncomeExpenseTransaction = observer(({ incomeExpenseTransaction }: IIncomeExpenseTransactionProps) => {
  const { dTransaction, account, contractor, category, sign, sum, note, tags } = incomeExpenseTransaction;

  return (
    <tr>
      <td>{dTransaction}</td>
      <td>
        <div>{account.name}</div>
        <div>{contractor?.name}</div>
      </td>
      <td>
        <div>{category.name}</div>
        <div>{category.parent?.name}</div>
      </td>
      <td>{sign === 1 && sum}</td>
      <td>{sign === -1 && sum}</td>
      <td>{note}</td>
      <td>
        {tags.map(tag => (
          <span key={tag}> {tag}</span>
        ))}
      </td>
    </tr>
  );
});
