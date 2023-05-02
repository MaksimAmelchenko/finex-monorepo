import { IRequestContext, TDate } from '../../types/app';

import { ActionType, PlanExcludeService } from './types';
import { planExcludeRepository } from './plan-exclude.repository';

class PlanExcludeServiceImpl implements PlanExcludeService {
  async cancelPlan(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    planId: string,
    exclusionDate: TDate
  ): Promise<void> {
    await planExcludeRepository.createPlanExclude(ctx, projectId, userId, planId, {
      exclusionDate,
      actionType: ActionType.Cancellation,
    });
  }

  async usePlan(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    planId: string,
    exclusionDate: TDate
  ): Promise<void> {
    await planExcludeRepository.createPlanExclude(ctx, projectId, userId, planId, {
      exclusionDate,
      actionType: ActionType.PlannedOperationEntered,
    });
  }
}

export const planExcludeService = new PlanExcludeServiceImpl();
