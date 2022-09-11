import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { IExchangeDTO } from '../../../../modules/exchange/types';
import { exchangeMapper } from '../../../../modules/exchange/exchange.mapper';
import { exchangeService } from '../../../../modules/exchange/exchange.service';

export async function handler(ctx: IRequestContext<{ exchangeId: string }, true>): Promise<
  IResponse<{
    exchange: IExchangeDTO;
  }>
> {
  const {
    projectId,
    userId,
    params: { exchangeId },
  } = ctx;

  const exchange = await exchangeService.getExchange(ctx, projectId, userId, exchangeId);

  return {
    body: {
      exchange: exchangeMapper.toDTO(exchange),
    },
  };
}
