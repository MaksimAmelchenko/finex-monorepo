import { FindExchangesServiceQuery, IExchangeDTO } from '../../../../modules/exchange/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { exchangeMapper } from '../../../../modules/exchange/exchange.mapper';
import { exchangeService } from '../../../../modules/exchange/exchange.service';

export async function handler(
  ctx: IRequestContext<
    Omit<FindExchangesServiceQuery, 'accountsSell' | 'accountsBuy' | 'tags'> & {
      accountsSell: string;
      accountsBuy: string;
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
    params: { accountsSell, accountsBuy, tags, ...params },
  } = ctx;

  const { exchanges, metadata } = await exchangeService.findExchanges(ctx, projectId, userId, {
    ...params,
    accountsSell: accountsSell ? accountsSell.split(',') : undefined,
    accountsBuy: accountsBuy ? accountsBuy.split(',') : undefined,
    tags: tags ? tags.split(',') : undefined,
  });

  return {
    body: {
      exchanges: exchanges.map(exchange => exchangeMapper.toDTO(exchange)),
      metadata,
    },
  };
}
