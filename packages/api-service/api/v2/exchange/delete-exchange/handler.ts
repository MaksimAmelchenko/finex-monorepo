import { StatusCodes } from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { exchangeService } from '../../../../modules/exchange/exchange.service';

export async function handler(ctx: IRequestContext<{ exchangeId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    userId,
    params: { exchangeId },
  } = ctx;
  await exchangeService.deleteExchange(ctx, projectId, userId, exchangeId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
