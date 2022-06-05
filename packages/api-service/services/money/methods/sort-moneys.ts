import { MoneyGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function sortMoneys(ctx: IRequestContext, projectId: string, moneyIds: string[]): Promise<void> {
  return MoneyGateway.sortMoneys(ctx, projectId, moneyIds);
}
