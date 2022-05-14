import { ApiRepository } from '../../core/other-stores/api-repository';
import { CancelPlanParams } from '../../types/plan';
import { IPlansApi } from '../plans-repository';

export class PlansApi extends ApiRepository implements IPlansApi {
  static override storeName = 'PlansApi';

  cancel(planId: string, params: CancelPlanParams): Promise<void> {
    return this.fetch<void>({
      method: 'POST',
      url: `/v2/plans/${planId}/cancel`,
      body: params,
    });
  }
}
