import { IRequestContext } from '../../../../types/app';
import { Money } from '../../model/money';

export async function getMoney(ctx: IRequestContext, projectId: string, moneyId: string): Promise<Money | undefined> {
  ctx.log.trace('try to get money');
  return Money.query(ctx.trx).findById([Number(projectId), Number(moneyId)]);
}
