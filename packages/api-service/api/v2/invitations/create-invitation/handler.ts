import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { UserGateway } from '../../../../services/user/gateway';
import { IUser } from '../../../../types/user';
import { NotFoundError } from '../../../../libs/errors';
import { IResponse } from '../../../../libs/rest-api/types';
import { User } from '../../../../services/user';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const { email: username } = ctx.params;
  const user: IUser | undefined = await UserGateway.getByUsername(ctx, username);
  if (!user) {
    throw new NotFoundError('Пользователь с таким электронным адресом еще не зарегистрирован');
  }

  const hostUser = await UserGateway.getById(ctx, ctx.userId!);

  const response = await dbRequest(ctx, 'cf.invitation.create', {
    ...ctx.params,
    authorization: null,
    idUserHost: ctx.userId,
    idUserGuest: user.id,
    emailHost: hostUser.email,
  });

  return {
    body: response,
  };
}
