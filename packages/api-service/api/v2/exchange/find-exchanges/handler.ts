import { FindExchangesServiceQuery, IExchangeDTO } from '../../../../modules/exchange/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { exchangeMapper } from '../../../../modules/exchange/exchange.mapper';
import { exchangeService } from '../../../../modules/exchange/exchange.service';

export async function handler(
  ctx: IRequestContext<
    Omit<FindExchangesServiceQuery, 'sellAccounts' | 'buyAccounts' | 'tags'> & {
      sellAccounts: string;
      buyAccounts: string;
      tags: string;
    },
    true
  >
): Promise<
  IResponse<{
    exchanges: IExchangeDTO[];
    metadata: {
      offset: number;
      limit: number;
      total: number;
    };
  }>
> {
  const {
    projectId,
    userId,
    params: { sellAccounts, buyAccounts, tags, ...params },
  } = ctx;

  const { exchanges, metadata } = await exchangeService.findExchanges(ctx, projectId, userId, {
    ...params,
    sellAccounts: sellAccounts ? sellAccounts.split(',') : undefined,
    buyAccounts: buyAccounts ? buyAccounts.split(',') : undefined,
    tags: tags ? tags.split(',') : undefined,
  });

  return {
    body: {
      exchanges: exchanges.map(exchange => exchangeMapper.toDTO(exchange)),
      metadata,
    },
  };
}
