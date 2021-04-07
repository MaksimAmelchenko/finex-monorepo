import * as moment from 'moment';
import { IRequestContext } from '../../../types/app';
import { ResetPasswordRequestGateway } from '../gateway';
import { UserGateway } from '../../user/gateway';
import { ConflictError, NotFoundError, GoneError } from '../../../libs/errors';
import { IUser } from '../../../types/user';
import { User } from '../../user';
import { IResetPasswordRequest } from '../../../types/reset-password-request';
import { hashPassword } from '../../auth/methods/hash-password';

export async function confirmResetPasswordRequest(
  ctx: IRequestContext,
  token: string,
  password: string
): Promise<void> {
  const resetPasswordRequest: IResetPasswordRequest | undefined = await ResetPasswordRequestGateway.getByToken(
    ctx,
    token
  );

  if (!resetPasswordRequest) {
    throw new NotFoundError();
  }

  if (resetPasswordRequest.resetAt) {
    throw new GoneError(`The password has already been reset`);
  }

  const user: IUser | undefined = await UserGateway.getByUsername(ctx, resetPasswordRequest.email);

  if (!user) {
    throw new ConflictError('User not found');
  }

  const hashedPassword = await hashPassword(password);

  await User.update(ctx, user.id, {
    password: hashedPassword,
  });

  await ResetPasswordRequestGateway.update(ctx, resetPasswordRequest.id, {
    reset_at: moment.utc().format(),
  });
}
