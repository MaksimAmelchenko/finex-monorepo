import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';
import { AccessDeniedError } from '../../../../libs/errors';
import { UserService } from '../../../../services/user';
import { User } from '../../../../services/user/model/user';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const { userId } = ctx;
  const user: User = await UserService.getUser(ctx, userId);
  if (user.email === 'demo@finex.io') {
    throw new AccessDeniedError('Demo account cannot be updated');
  }

  const response = await dbRequest(ctx, 'cf.profile.update', ctx.params);
  return {
    body: response,
  };
}
