import { StatusCodes } from 'http-status-codes';

import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { moneyService } from '../../../../modules/money/money.service';

export async function handler(ctx: IRequestContext<{ moneyIds: string[] }, true>): Promise<IResponse> {
  const {
    projectId,
    params: { moneyIds },
  } = ctx;
  await moneyService.sortMoneys(ctx, projectId, moneyIds);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
