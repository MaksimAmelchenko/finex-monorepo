import { Money } from '../model/money';
import { MoneyGateway } from '../gateway';
import { CreateMoneyServiceData } from '../types';
import { IRequestContext } from '../../../types/app';

export async function createMoney(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateMoneyServiceData
): Promise<Money> {
  return MoneyGateway.createMoney(ctx, projectId, userId, data);
}
