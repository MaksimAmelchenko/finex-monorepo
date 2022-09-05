import { IRequestContext } from '../../../../types/app';
import { ResetPasswordRequest } from '../../../../services/reset-password-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse> {
  const { token, password } = ctx.params;
  await ResetPasswordRequest.confirm(ctx, token, password);
  return {
    body: {},
  };
}
