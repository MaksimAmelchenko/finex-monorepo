import { IRequestContext } from '../../../../types/app';
import { Money } from '../../model/money';

export async function getMoneys(ctx: IRequestContext, projectId: string): Promise<Money[]> {
  ctx.log.trace('try to get moneys');
  return Money.query(ctx.trx).where({
    idProject: Number(projectId),
  });
}
