import { IRequestContext } from '../../../../types/app';
import { ResetPasswordRequest } from '../../../../services/reset-password-request';
import { IResetPasswordRequest } from '../../../../types/reset-password-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<any, false>): Promise<IResponse> {
  const { email } = ctx.params;
  const { ip, origin } = ctx.additionalParams;

  const resetPasswordRequest: IResetPasswordRequest = await ResetPasswordRequest.create(ctx, {
    email,
    ip,
    origin,
  });

  return {
    body: {
      resetPasswordRequest: {
        id: resetPasswordRequest.id,
      },
    },
  };
}
