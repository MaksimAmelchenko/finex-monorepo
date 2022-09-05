import { StatusCodes } from 'http-status-codes';

import { CancelPlanServiceParams } from '../../../../services/plan/types';
import { INoContent, IResponse } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { PlanService } from '../../../../services/plan';

export async function handler(
  ctx: IRequestContext<CancelPlanServiceParams & { planId: string }, true>
): Promise<IResponse<INoContent>> {
  const { planId, ...params } = ctx.params;
  await PlanService.cancelPlan(ctx, planId, params);

  return {
    body: {
      status: StatusCodes.NO_CONTENT,
    },
  };
}
