import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { IncomeExpenseTransaction } from './IncomeExpenseTransaction/IncomeExpenseTransaction';
import { IncomeExpenseTransactionsRepository } from '../../stores/income-expense-transactions-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

const t = getT('CashFlow');

export const IncomeExpenseTransactions = observer(() => {
  const incomeExpenseTransactionsRepository = useStore(IncomeExpenseTransactionsRepository);

  const { incomeExpenseTransactions, loadState } = incomeExpenseTransactionsRepository;

  useEffect(() => {
    incomeExpenseTransactionsRepository.fetch().catch(console.error);
  }, []);

  if (loadState.isPending() && !incomeExpenseTransactions.length) {
    return <div>Loading...</div>;
  }

  return (
    <article>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>
              Счет
              <br />
              Контрагент
            </th>
            <th>Категория</th>
            <th>Доход</th>
            <th>Расход</th>
            <th className="hidden-xs hidden-sm">Примечание</th>
            <th className="hidden-xs hidden-sm">Теги</th>
          </tr>
        </thead>
        <tbody>
          {incomeExpenseTransactions.map((incomeExpenseTransaction, index) => (
            <IncomeExpenseTransaction
              incomeExpenseTransaction={incomeExpenseTransaction}
              key={incomeExpenseTransaction.id ?? index}
            />
          ))}
        </tbody>
      </table>
    </article>
  );
});
