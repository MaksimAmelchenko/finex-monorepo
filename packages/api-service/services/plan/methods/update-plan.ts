import { CancelPlanServiceParams } from '../types';
import { IRequestContext } from '../../../types/app';
import { PlanGateway } from '../gateway';

export async function cancelPlan(
  ctx: IRequestContext<unknown, true>,
  planId: string,
  params: CancelPlanServiceParams
): Promise<void> {
  return PlanGateway.cancelPlan(ctx, planId, params);
}
