import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { MoneyService } from '../../../../services/money';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse> {
  const {
    projectId,
    params: { moneyId, currencyId, isEnabled, name, precision, sorting, symbol },
  } = ctx;
  const money = await MoneyService.updateMoney(ctx, projectId, moneyId, {
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
