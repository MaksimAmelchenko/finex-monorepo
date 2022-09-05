import { IRequestContext } from '../../../../types/app';
import { SignUpRequest } from '../../../../services/sign-up-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<{ token: string }, true>): Promise<IResponse> {
  const { token } = ctx.params;
  await SignUpRequest.confirm(ctx, token);
  return {
    body: {},
  };
}
