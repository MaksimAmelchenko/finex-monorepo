import { Money } from '../model/money';
import { MoneyGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { UpdateMoneyServiceChanges } from '../types';
import { NotFoundError } from '../../../libs/errors';

export async function updateMoney(
  ctx: IRequestContext,
  projectId: string,
  moneyId: string,
  changes: UpdateMoneyServiceChanges
): Promise<Money> {
  const money = await MoneyGateway.getMoney(ctx, projectId, moneyId);
  if (!money) {
    throw new NotFoundError('Money is not found');
  }
  return MoneyGateway.updateMoney(ctx, projectId, moneyId, changes);
}
