import { IExchangeDTO, UpdateExchangeServiceChanges } from '../../../../modules/exchange/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { exchangeMapper } from '../../../../modules/exchange/exchange.mapper';
import { exchangeService } from '../../../../modules/exchange/exchange.service';

export async function handler(
  ctx: IRequestContext<UpdateExchangeServiceChanges & { exchangeId: string }, true>
): Promise<IResponse<{ exchange: IExchangeDTO }>> {
  const {
    projectId,
    userId,
    params: { exchangeId, ...changes },
  } = ctx;
  const exchange = await exchangeService.updateExchange(ctx, projectId, userId, exchangeId, changes);

  return {
    body: {
      exchange: exchangeMapper.toDTO(exchange),
    },
  };
}
