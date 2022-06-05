import { Money } from '../../model/money';
import { IRequestContext } from '../../../../types/app';
import { CreateMoneyGatewayData } from '../../types';

export async function createMoney(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateMoneyGatewayData
): Promise<Money> {
  ctx.log.trace({ data }, 'try to create money');
  const { currencyId, ...rest } = data;

  const money = await Money.query(ctx.trx).insertAndFetch({
    idProject: Number(projectId),
    idUser: Number(userId),
    idCurrency: currencyId ? Number(currencyId) : null,
    ...rest,
  });

  ctx.log.info({ moneyId: money.idMoney }, 'created money');
  return money;
}
