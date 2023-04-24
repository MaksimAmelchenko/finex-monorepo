import { IRequestContext } from '../../../../types/app';
import { SignUpRequest } from '../../../../services/sign-up-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<any, false>): Promise<IResponse> {
  const { signUpRequestId } = ctx.params;
  const { ip, origin } = ctx.additionalParams;

  await SignUpRequest.resend(ctx, signUpRequestId, origin);
  return {
    body: {},
  };
}
