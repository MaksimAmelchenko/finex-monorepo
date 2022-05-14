import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { CancelPlanParams } from '../types/plan';

export interface IPlansApi {
  cancel: (planId: string, params: CancelPlanParams) => Promise<void>;
}

export class PlansRepository extends ManageableStore {
  static storeName = 'PlansRepository';

  constructor(mainStore: MainStore, private api: IPlansApi) {
    super(mainStore);
  }

  cancelPlan(planId: string, params: CancelPlanParams): Promise<void> {
    return this.api.cancel(planId, params);
  }

  clear(): void {}
}
