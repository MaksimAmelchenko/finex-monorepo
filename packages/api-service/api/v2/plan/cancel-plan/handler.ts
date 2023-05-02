import { StatusCodes } from 'http-status-codes';

import { INoContent, IResponse } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { planExcludeService } from '../../../../modules/plan-exclude/plan-exclude.service';

export async function handler(
  ctx: IRequestContext<{ planId: string; exclusionDate: string }, true>
): Promise<IResponse<INoContent>> {
  const {
    projectId,
    userId,
    params: { planId, exclusionDate },
  } = ctx;
  await planExcludeService.cancelPlan(ctx, projectId, userId, planId, exclusionDate);

  return {
    body: {
      status: StatusCodes.NO_CONTENT,
    },
  };
}
