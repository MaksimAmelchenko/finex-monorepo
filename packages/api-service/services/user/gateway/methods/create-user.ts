import { CreateUserGatewayData } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { User } from '../../model/user';

export async function createUser(ctx: IRequestContext, data: CreateUserGatewayData): Promise<User> {
  ctx.log.trace({ data }, 'try to create user');

  const { currencyRateSourceId, householdId, ...rest } = data;

  const user = await User.query(ctx.trx).insertAndFetch({
    idCurrencyRateSource: Number(currencyRateSourceId),
    idHousehold: Number(householdId),
    timeout: 'PT20M',
    ...rest,
  });

  ctx.log.info({ userId: user.idUser }, 'created user');
  return user;
}
