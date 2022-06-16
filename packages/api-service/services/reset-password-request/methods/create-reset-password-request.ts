import { NotFoundError } from '../../../libs/errors';

import { IRequestContext } from '../../../types/app';
import { ICreateParams, IResetPasswordRequest } from '../../../types/reset-password-request';
import { ResetPasswordRequestGateway } from '../gateway';
import { UserGateway } from '../../user/gateway';
import { TransactionalEmail } from '../../transactional-email';
import { getResetPasswordConfirmationUrl } from './get-reset-password-confirmation-url';
import { Template } from '../../../types/transactional-email';

export async function createResetPasswordRequest(
  ctx: IRequestContext,
  params: ICreateParams
): Promise<IResetPasswordRequest> {
  const { email, ip } = params;

  const user = await UserGateway.getUserByUsername(ctx, email);

  if (!user) {
    throw new NotFoundError('Email not found');
  }

  const resetPasswordRequest: IResetPasswordRequest = await ResetPasswordRequestGateway.create(ctx, {
    email,
    ip,
  });

  TransactionalEmail.send(ctx, {
    template: Template.PasswordReset,
    email,
    locals: {
      url: getResetPasswordConfirmationUrl(resetPasswordRequest.token),
    },
  }).catch(err => ctx.log.fatal({ err }));

  return resetPasswordRequest;
}
