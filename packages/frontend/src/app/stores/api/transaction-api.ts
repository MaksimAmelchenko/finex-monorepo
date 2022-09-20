import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';

import {
  CreateTransactionData,
  CreateTransactionResponse,
  GetTransactionsQuery,
  GetTransactionsResponse,
  ITransactionsApi,
  UpdateTransactionChanges,
  UpdateTransactionResponse,
} from '../../types/transaction';

export class TransactionsApi extends ApiRepository implements ITransactionsApi {
  static override storeName = 'TransactionsApi';

  get(query: GetTransactionsQuery): Promise<GetTransactionsResponse> {
    return this.fetch<GetTransactionsResponse>({
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
