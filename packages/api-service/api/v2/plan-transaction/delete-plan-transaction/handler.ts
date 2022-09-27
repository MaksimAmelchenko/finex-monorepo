import { StatusCodes } from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { planTransactionService } from '../../../../modules/plan-transaction/plan-transaction.service';

export async function handler(ctx: IRequestContext<{ planId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    params: { planId },
  } = ctx;

  await planTransactionService.deletePlanTransaction(ctx, projectId, planId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
