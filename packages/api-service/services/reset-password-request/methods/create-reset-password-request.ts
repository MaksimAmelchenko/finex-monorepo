import { ICreateParams, IResetPasswordRequest } from '../../../types/reset-password-request';
import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';
import { ResetPasswordRequestGateway } from '../gateway';
import { Template } from '../../../types/transactional-email';
import { TransactionalEmail } from '../../transactional-email';
import { getResetPasswordConfirmationUrl } from './get-reset-password-confirmation-url';
import { userRepository } from '../../../modules/user/user.repository';

export async function createResetPasswordRequest(
  ctx: IRequestContext,
  params: ICreateParams
): Promise<IResetPasswordRequest> {
  const { email, ip } = params;

  const user = await userRepository.getUserByUsername(ctx, email);

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
