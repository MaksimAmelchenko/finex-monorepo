import * as HttpStatus from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { debtService } from '../../../../modules/debt/debt.service';

export async function handler(ctx: IRequestContext<{ debtId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    userId,
    params: { debtId },
  } = ctx;
  await debtService.deleteDebt(ctx, projectId, userId, debtId);

  return {
    status: HttpStatus.StatusCodes.NO_CONTENT,
  };
}
