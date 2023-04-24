import { IMoneyDTO } from '../../../../modules/money/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { moneyMapper } from '../../../../modules/money/money.mapper';
import { moneyService } from '../../../../modules/money/money.service';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse<{ money: IMoneyDTO }>> {
  const {
    projectId,
    params: { moneyId, currencyCode, isEnabled, name, precision, sorting, symbol },
  } = ctx;
  const money = await moneyService.updateMoney(ctx, projectId, moneyId, {
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
