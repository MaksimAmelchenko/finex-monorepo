import { CreateExchangeServiceData, IExchangeDTO } from '../../../../modules/exchange/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { exchangeMapper } from '../../../../modules/exchange/exchange.mapper';
import { exchangeService } from '../../../../modules/exchange/exchange.service';

export async function handler(
  ctx: IRequestContext<CreateExchangeServiceData, true>
): Promise<IResponse<{ exchange: IExchangeDTO }>> {
  const { params, projectId, userId } = ctx;
  const exchange = await exchangeService.createExchange(ctx, projectId, userId, params);

  return {
    body: {
      exchange: exchangeMapper.toDTO(exchange),
    },
  };
}
