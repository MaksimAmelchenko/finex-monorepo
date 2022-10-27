import { StatusCodes } from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { cashFlowService } from '../../../../modules/cahsflow/cashflow.service';

export async function handler(ctx: IRequestContext<{ cashFlowId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    userId,
    params: { cashFlowId },
  } = ctx;
  await cashFlowService.deleteCashFlow(ctx, projectId, userId, cashFlowId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
