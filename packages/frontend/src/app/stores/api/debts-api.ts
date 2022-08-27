import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';
import { IDebtsApi } from '../debts-repository';
import {
  CreateDebtData,
  CreateDebtItemData,
  CreateDebtItemResponse,
  CreateDebtResponse,
  GetDebtsQuery,
  GetDebtsResponse,
  UpdateDebtChanges,
  UpdateDebtItemChanges,
  UpdateDebtItemResponse,
  UpdateDebtResponse,
} from '../../types/debt';

export class DebtsApi extends ApiRepository implements IDebtsApi {
  static override storeName = 'DebtsApi';

  getDebts(query: GetDebtsQuery): Promise<GetDebtsResponse> {
    return this.fetch<GetDebtsResponse>({
      url: `/v2/debts?${queryString.stringify(query, { skipNull: true, skipEmptyString: true })}`,
    });
  }

  createDebt(data: CreateDebtData): Promise<CreateDebtResponse> {
    return this.fetch<CreateDebtResponse>({
      method: 'POST',
      url: '/v2/debts',
      body: data,
    });
  }

  createDebtItem(debtId: string, data: CreateDebtItemData): Promise<CreateDebtItemResponse> {
    return this.fetch<CreateDebtItemResponse>({
      method: 'POST',
      url: `/v2/debts/${debtId}/items`,
      body: data,
    });
  }

  updateDebt(debtId: string, changes: UpdateDebtChanges): Promise<UpdateDebtResponse> {
    return this.fetch<CreateDebtResponse>({
      method: 'PATCH',
      url: `/v2/debts/${debtId}`,
      body: changes,
    });
  }

  updateDebtItem(debtId: string, debtItemId: string, changes: UpdateDebtItemChanges): Promise<UpdateDebtItemResponse> {
    return this.fetch<CreateDebtItemResponse>({
      method: 'PATCH',
      url: `/v2/debts/${debtId}/items/${debtItemId}`,
      body: changes,
    });
  }

  deleteDebt(debtId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/debts/${debtId}`,
    });
  }

  deleteDebtItem(debtId: string, debtItemId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/debts/${debtId}/items/${debtItemId}`,
    });
  }
}
