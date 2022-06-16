import { IRequestContext } from '../../../types/app';
import { ResetPasswordRequestGateway } from '../gateway';
import { UserGateway } from '../../user/gateway';
import { GoneError, NotFoundError } from '../../../libs/errors';
import { UserService } from '../../user';
import { IResetPasswordRequest } from '../../../types/reset-password-request';
import { hashPassword } from '../../auth/methods/hash-password';
import { User } from '../../user/model/user';

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

  const user: User | undefined = await UserGateway.getUserByUsername(ctx, resetPasswordRequest.email);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const hashedPassword = await hashPassword(password);

  await UserService.updateUser(ctx, String(user.idUser), {
    password: hashedPassword,
  });

  await ResetPasswordRequestGateway.update(ctx, resetPasswordRequest.id, {
    reset_at: new Date().toISOString(),
  });
}
