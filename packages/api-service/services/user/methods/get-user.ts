import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';
import { User } from '../model/user';
import { UserGateway } from '../gateway';

export async function getUser(ctx: IRequestContext, userId: string): Promise<User> {
  const user: User | undefined = await UserGateway.getUser(ctx, userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}
