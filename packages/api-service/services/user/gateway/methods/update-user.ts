import { IRequestContext } from '../../../../types/app';
import { UpdateUserGatewayChanges } from '../../types';
import { User } from '../../model/user';

export async function updateUser(
  ctx: IRequestContext,
  userId: string,
  changes: UpdateUserGatewayChanges
): Promise<User> {
  ctx.log.trace({ changes }, 'try to update session');
  const { currencyRateSourceId, projectId, ...rest } = changes;

  const idCurrencyRateSource = currencyRateSourceId === undefined ? undefined : Number(currencyRateSourceId);

  const idProject = projectId === undefined ? undefined : Number(projectId);

  const user = await User.query(ctx.trx).patchAndFetchById(Number(userId), {
    idCurrencyRateSource,
    idProject,
    ...rest,
  });

  ctx.log.trace({ userId: user.idUser }, 'updated user');
  return user;
}
