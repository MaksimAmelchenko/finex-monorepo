import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';
import { AccessDeniedError } from '../../../../libs/errors';
import { userService } from '../../../../modules/user/user.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse> {
  const { userId } = ctx;
  const { email } = await userService.getUser(ctx, userId);
  if (email === 'demo@finex.io') {
    throw new AccessDeniedError('Demo account cannot be updated');
  }

  const response = await dbRequest(ctx, 'cf.profile.update', ctx.params);
  return {
    body: response,
  };
}
