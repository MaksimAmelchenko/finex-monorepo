import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';
import { UserGateway } from '../../../../services/user/gateway';
import { AccessDeniedError } from '../../../../libs/errors';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const user = await UserGateway.getById(ctx, ctx.userId!);
  if (user.email === 'demo@finex.io') {
    throw new AccessDeniedError('Demo account cannot be updated');
  }

  const response = await dbRequest(ctx, 'cf.profile.update', ctx.params);
  return {
    body: response,
  };
}
