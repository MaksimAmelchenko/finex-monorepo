import { MoneyGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';

export async function deleteMoney(ctx: IRequestContext, projectId: string, moneyId: string): Promise<void> {
  const money = await MoneyGateway.getMoney(ctx, projectId, moneyId);
  if (!money) {
    throw new NotFoundError('Money is not found');
  }
  return MoneyGateway.deleteMoney(ctx, projectId, moneyId);
}
