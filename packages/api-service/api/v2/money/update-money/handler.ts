import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { MoneyService } from '../../../../services/money';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse> {
  const {
    projectId,
    params: { moneyId, ...changes },
  } = ctx;
  const money = await MoneyService.updateMoney(ctx, projectId, moneyId, changes);

  return {
    body: {
      money: money.toPublicModel(),
    },
  };
}
