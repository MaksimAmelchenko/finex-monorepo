import queryString from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  CreateCashFlowData,
  CreateCashFlowItemData,
  CreateCashFlowItemResponse,
  CreateCashFlowResponse,
  GetCashFlowsQuery,
  GetCashFlowsResponse,
  ICashFlowsApi,
  UpdateCashFlowChanges,
  UpdateCashFlowItemChanges,
  UpdateCashFlowItemResponse,
  UpdateCashFlowResponse,
} from '../../types/cash-flow';

export class CashFlowsApi extends ApiRepository implements ICashFlowsApi {
  static override storeName = 'CashFlowsApi';

  getCashFlows(query: GetCashFlowsQuery): Promise<GetCashFlowsResponse> {
    return this.fetch<GetCashFlowsResponse>({
      url: `/v2/cash-flows?${queryString.stringify(query, { skipNull: true, skipEmptyString: true })}`,
    });
  }

  createCashFlow(data: CreateCashFlowData): Promise<CreateCashFlowResponse> {
    return this.fetch<CreateCashFlowResponse>({
      method: 'POST',
      url: '/v2/cash-flows',
      body: data,
    });
  }

  createCashFlowItem(cashFlowId: string, data: CreateCashFlowItemData): Promise<CreateCashFlowItemResponse> {
    return this.fetch<CreateCashFlowItemResponse>({
      method: 'POST',
      url: `/v2/cash-flows/${cashFlowId}/items`,
      body: data,
    });
  }

  updateCashFlow(cashFlowId: string, changes: UpdateCashFlowChanges): Promise<UpdateCashFlowResponse> {
    return this.fetch<CreateCashFlowResponse>({
      method: 'PATCH',
      url: `/v2/cash-flows/${cashFlowId}`,
      body: changes,
    });
  }

  updateCashFlowItem(
    cashFlowId: string,
    cashFlowItemId: string,
    changes: UpdateCashFlowItemChanges
  ): Promise<UpdateCashFlowItemResponse> {
    return this.fetch<CreateCashFlowItemResponse>({
      method: 'PATCH',
      url: `/v2/cash-flows/${cashFlowId}/items/${cashFlowItemId}`,
      body: changes,
    });
  }

  deleteCashFlow(cashFlowId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/cash-flows/${cashFlowId}`,
    });
  }

  deleteCashFlowItem(cashFlowId: string, cashFlowItemId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/cash-flows/${cashFlowId}/items/${cashFlowItemId}`,
    });
  }
}
