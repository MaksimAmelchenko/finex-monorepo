import { IRequestContext } from '../../types/app';
import { userRepository } from '../../modules/user/user.repository';

export async function deleteUser(ctx: IRequestContext, username: string): Promise<void> {
  const user = await userRepository.getUserByUsername(ctx, username);

  if (user) {
    await userRepository.deleteUser(ctx, String(user.idUser));
  }
}
