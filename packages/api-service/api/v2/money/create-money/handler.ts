import { IMoneyDTO } from '../../../../modules/money/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { moneyService } from '../../../../modules/money/money.service';
import { moneyMapper } from '../../../../modules/money/money.mapper';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse<{ money: IMoneyDTO }>> {
  const {
    params: { currencyCode, isEnabled, name, precision, sorting, symbol },
    projectId,
    userId,
  } = ctx;
  const money = await moneyService.createMoney(ctx, projectId, userId, {
    currencyCode,
    isEnabled,
    name,
    precision,
    sorting,
    symbol,
  });

  return {
    body: {
      money: moneyMapper.toDTO(money),
    },
  };
}
