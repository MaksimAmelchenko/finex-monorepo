import { StatusCodes } from 'http-status-codes';

import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { MoneyService } from '../../../../services/money';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse<Record<string, never>>> {
  const {
    projectId,
    params: { moneyId },
  } = ctx;
  await MoneyService.deleteMoney(ctx, projectId, moneyId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
