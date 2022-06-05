import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { MoneyService } from '../../../../services/money';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const { projectId } = ctx;
  const moneys = await MoneyService.getMoneys(ctx, projectId);

  return {
    body: {
      moneys: moneys.map(money => money.toPublicModel()),
    },
  };
}
