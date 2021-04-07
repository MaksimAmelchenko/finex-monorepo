import { IRequestContext } from '../../../../types/app';
import { SignUpRequest } from '../../../../services/sign-up-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const { signUpRequestId } = ctx.params;
  await SignUpRequest.resend(ctx, signUpRequestId);
  return {
    body: {},
  };
}
