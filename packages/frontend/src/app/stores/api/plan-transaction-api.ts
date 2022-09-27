import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  CreatePlanTransactionData,
  CreatePlanTransactionResponse,
  GetPlanTransactionsResponse,
  IPlanTransactionsApi,
  UpdatePlanTransactionChanges,
  UpdatePlanTransactionResponse,
} from '../../types/plan-transaction';

export class PlanTransactionsApi extends ApiRepository implements IPlanTransactionsApi {
  static override storeName = 'PlanTransactionsApi';

  get(): Promise<GetPlanTransactionsResponse> {
    return this.fetch<GetPlanTransactionsResponse>({
      url: '/v2/plan-transactions',
    });
  }

  create(data: CreatePlanTransactionData): Promise<CreatePlanTransactionResponse> {
    return this.fetch<CreatePlanTransactionResponse>({
      method: 'POST',
      url: '/v2/plan-transactions',
      body: data,
    });
  }

  update(planId: string, changes: UpdatePlanTransactionChanges): Promise<UpdatePlanTransactionResponse> {
    return this.fetch<UpdatePlanTransactionResponse>({
      method: 'PATCH',
      url: `/v2/plan-transactions/${planId}`,
      body: changes,
    });
  }

  remove(planId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/plan-transactions/${planId}`,
    });
  }
}
