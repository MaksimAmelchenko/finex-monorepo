import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  CreateTransactionData,
  CreateTransactionResponse,
  UpdateTransactionChanges,
  UpdateTransactionResponse,
} from '../../types/transaction';
import { GetOperationsQuery, GetOperationsResponse, IOperationsApi } from '../../types/operation';
import {
  CreateTransferData,
  CreateTransferResponse,
  UpdateTransferChanges,
  UpdateTransferResponse,
} from '../../types/transfer';

export class OperationsApi extends ApiRepository implements IOperationsApi {
  static override storeName = 'OperationsApi';

  get(query: GetOperationsQuery): Promise<GetOperationsResponse> {
    return this.fetch<GetOperationsResponse>({
      url: `/v1/operations?${queryString.stringify(query, { skipNull: true, skipEmptyString: true })}`,
    });
  }

  createTransaction(data: CreateTransactionData): Promise<CreateTransactionResponse> {
    return this.fetch<CreateTransactionResponse>({
      method: 'POST',
      url: '/v2/transactions',
      body: data,
    });
  }

  updateTransaction(transactionId: string, changes: UpdateTransactionChanges): Promise<UpdateTransactionResponse> {
    return this.fetch<UpdateTransactionResponse>({
      method: 'PATCH',
      url: `/v2/transactions/${transactionId}`,
      body: changes,
    });
  }

  deleteTransaction(transactionId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/transactions/${transactionId}`,
    });
  }

  createTransfer(data: CreateTransferData): Promise<CreateTransferResponse> {
    return this.fetch<CreateTransferResponse>({
      method: 'POST',
      url: '/v2/transfers',
      body: data,
    });
  }

  updateTransfer(transferId: string, changes: UpdateTransferChanges): Promise<UpdateTransferResponse> {
    return this.fetch<CreateTransferResponse>({
      method: 'PATCH',
      url: `/v2/transfers/${transferId}`,
      body: changes,
    });
  }

  deleteTransfer(transferId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/transfers/${transferId}`,
    });
  }
}
