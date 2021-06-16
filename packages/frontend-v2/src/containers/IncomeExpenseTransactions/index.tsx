import { h } from 'preact';

import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';
import { IncomeExpenseTransactionsRepository } from '../../stores/income-expense-transactions-repository';
import { useEffect } from 'preact/hooks';
import { IncomeExpenseTransaction } from './IncomeExpenseTransaction';
import { observer } from 'mobx-react-lite';

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
          {incomeExpenseTransactions.map(incomeExpenseTransaction => (
            <IncomeExpenseTransaction
              incomeExpenseTransaction={incomeExpenseTransaction}
              key={incomeExpenseTransaction.id}
            />
          ))}
        </tbody>
      </table>
    </article>
  );
});
