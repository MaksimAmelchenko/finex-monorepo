import { Money } from '../../model/money';
import { IRequestContext } from '../../../../types/app';
import { UpdateMoneyGatewayChanges } from '../../types';

export async function updateMoney(
  ctx: IRequestContext,
  projectId: string,
  moneyId: string,
  changes: UpdateMoneyGatewayChanges
): Promise<Money> {
  ctx.log.trace({ projectId, moneyId, changes }, 'try to update money');
  const { currencyId, ...rest } = changes;

  const money = await Money.query(ctx.trx).patchAndFetchById([Number(projectId), Number(moneyId)], {
    ...rest,
    idCurrency: currencyId ? Number(currencyId) : null,
  });

  ctx.log.info({ moneyId }, 'updated money');
  return money;
}
