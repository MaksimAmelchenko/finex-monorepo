import { GoneError, NotFoundError } from '../../../libs/errors';
import { IRequestContext } from '../../../types/app';
import { IResetPasswordRequest } from '../../../types/reset-password-request';
import { IUserDAO } from '../../../modules/user/types';
import { ResetPasswordRequestGateway } from '../gateway';
import { hashPassword } from '../../auth/methods/hash-password';
import { userRepository } from '../../../modules/user/user.repository';
import { userService } from '../../../modules/user/user.service';

export async function confirmResetPasswordRequest(
  ctx: IRequestContext<unknown, true>,
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

  const user: IUserDAO | undefined = await userRepository.getUserByUsername(ctx, resetPasswordRequest.email);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const hashedPassword = await hashPassword(password);

  await userRepository.updateUser(ctx, String(user.idUser), {
    password: hashedPassword,
  });

  await ResetPasswordRequestGateway.update(ctx, resetPasswordRequest.id, {
    reset_at: new Date().toISOString(),
  });
}
