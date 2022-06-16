import { Money } from '../../model/money';
import { IRequestContext } from '../../../../types/app';

export async function deleteMoney(ctx: IRequestContext, projectId: string, moneyId: string): Promise<void> {
  ctx.log.trace({ moneyId }, 'try to delete money');

  await Money.query(ctx.trx).deleteById([Number(projectId), Number(moneyId)]);

  ctx.log.info({ moneyId }, 'deleted money');
}
