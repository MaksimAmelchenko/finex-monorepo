import { Money } from '../model/money';
import { MoneyGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function getMoneys(ctx: IRequestContext, projectId: string): Promise<Money[]> {
  return MoneyGateway.getMoneys(ctx, projectId);
}
