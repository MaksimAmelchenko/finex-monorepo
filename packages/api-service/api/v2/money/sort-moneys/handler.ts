import { StatusCodes } from 'http-status-codes';

import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { MoneyService } from '../../../../services/money';

export async function handler(ctx: IRequestContext<{ moneyIds: string[] }>): Promise<IResponse> {
  const {
    projectId,
    params: { moneyIds },
  } = ctx;
  await MoneyService.sortMoneys(ctx, projectId, moneyIds);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
