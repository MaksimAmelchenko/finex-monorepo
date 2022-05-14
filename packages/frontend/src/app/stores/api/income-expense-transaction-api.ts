import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';
import { IIncomeExpenseTransactionsApi } from '../income-expense-transactions-repository';
import {
  CreateTransactionData,
  CreateTransactionResponse,
  GetIncomeExpenseTransactionsQuery,
  GetIncomeExpenseTransactionsResponse,
  UpdateTransactionChanges,
  UpdateTransactionResponse,
} from '../../types/income-expense-transaction';

export class IncomeExpenseTransactionsApi extends ApiRepository implements IIncomeExpenseTransactionsApi {
  static override storeName = 'IncomeExpenseTransactionsApi';

  get(query: GetIncomeExpenseTransactionsQuery): Promise<GetIncomeExpenseTransactionsResponse> {
    return this.fetch<GetIncomeExpenseTransactionsResponse>({
      url: `/v2/transactions?${queryString.stringify(query, { skipNull: true, skipEmptyString: true })}`,
    });
  }

  create(data: CreateTransactionData): Promise<CreateTransactionResponse> {
    return this.fetch<CreateTransactionResponse>({
      method: 'POST',
      url: '/v2/transactions',
      body: data,
    });
  }

  update(transactionId: string, changes: UpdateTransactionChanges): Promise<UpdateTransactionResponse> {
    return this.fetch<CreateTransactionResponse>({
      method: 'PATCH',
      url: `/v2/transactions/${transactionId}`,
      body: changes,
    });
  }

  remove(transactionId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/transactions/${transactionId}`,
    });
  }
}
