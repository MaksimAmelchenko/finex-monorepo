import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  CreateTransferData,
  CreateTransferResponse,
  GetTransfersQuery,
  GetTransfersResponse,
  ITransfersApi,
  UpdateTransferChanges,
  UpdateTransferResponse,
} from '../../types/transfer';

export class TransfersApi extends ApiRepository implements ITransfersApi {
  static override storeName = 'TransfersApi';

  getTransfers(query: GetTransfersQuery): Promise<GetTransfersResponse> {
    return this.fetch<GetTransfersResponse>({
      url: `/v2/transfers?${queryString.stringify(query, { skipNull: true, skipEmptyString: true })}`,
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
