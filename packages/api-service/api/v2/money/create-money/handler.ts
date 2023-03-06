import { IPublicMoney } from '../../../../services/money/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { MoneyService } from '../../../../services/money';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse<{ money: IPublicMoney }>> {
  const {
    params: { currencyId, isEnabled, name, precision, sorting, symbol },
    projectId,
    userId,
  } = ctx;
  const money = await MoneyService.createMoney(ctx, projectId, userId, {
    currencyId,
    isEnabled,
    name,
    precision,
    sorting,
    symbol,
  });

  return {
    body: {
      money: money.toPublicModel(),
    },
  };
}
