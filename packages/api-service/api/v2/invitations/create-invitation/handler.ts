import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { NotFoundError } from '../../../../libs/errors';
import { userRepository } from '../../../../modules/user/user.repository';

export async function handler(ctx: IRequestContext<{ email: string }, true>): Promise<IResponse> {
  const { email: username } = ctx.params;
  const user = await userRepository.getUserByUsername(ctx, username);
  if (!user) {
    throw new NotFoundError('Пользователь с таким электронным адресом еще не зарегистрирован');
  }

  const hostUser = await userRepository.getUser(ctx, ctx.userId);
  if (!hostUser) {
    throw new NotFoundError();
  }

  const response = await dbRequest(ctx, 'cf.invitation.create', {
    ...ctx.params,
    authorization: null,
    idUserHost: ctx.userId,
    idUserGuest: user.idUser,
    emailHost: hostUser.email,
  });

  return {
    body: response,
  };
}
