import { StatusCodes } from 'http-status-codes';

import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { moneyService } from '../../../../modules/money/money.service';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse<Record<string, never>>> {
  const {
    projectId,
    params: { moneyId },
  } = ctx;
  await moneyService.deleteMoney(ctx, projectId, moneyId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
