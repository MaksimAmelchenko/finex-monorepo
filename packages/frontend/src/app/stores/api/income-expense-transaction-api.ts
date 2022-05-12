import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';
import { IIncomeExpenseTransactionsApi } from '../income-expense-transactions-repository';
import {
  CreateIncomeExpenseTransactionData,
  CreateIncomeExpenseTransactionResponse,
  GetIncomeExpenseTransactionsQuery,
  GetIncomeExpenseTransactionsResponse,
  UpdateIncomeExpenseTransactionChanges,
  UpdateIncomeExpenseTransactionResponse,
} from '../../types/income-expense-transaction';

export class IncomeExpenseTransactionsApi extends ApiRepository implements IIncomeExpenseTransactionsApi {
  static override storeName = 'IncomeExpenseTransactionsApi';

  get(query: GetIncomeExpenseTransactionsQuery): Promise<GetIncomeExpenseTransactionsResponse> {
    return this.fetch<GetIncomeExpenseTransactionsResponse>({
      url: `/v2/transactions?${queryString.stringify(query, { skipNull: true, skipEmptyString: true })}`,
    });
  }

  create(data: CreateIncomeExpenseTransactionData): Promise<CreateIncomeExpenseTransactionResponse> {
    return this.fetch<CreateIncomeExpenseTransactionResponse>({
      method: 'POST',
      url: '/v2/transactions',
      body: data,
    });
  }

  update(
    transactionId: string,
    changes: UpdateIncomeExpenseTransactionChanges
  ): Promise<UpdateIncomeExpenseTransactionResponse> {
    return this.fetch<CreateIncomeExpenseTransactionResponse>({
      method: 'PATCH',
      url: `/v2/transactions/${transactionId}`,
      body: changes,
    });
  }
}
