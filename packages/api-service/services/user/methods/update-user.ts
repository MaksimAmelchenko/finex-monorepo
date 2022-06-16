import { IRequestContext } from '../../../types/app';
import { UpdateUserGatewayChanges } from '../types';
import { User } from '../model/user';
import { UserGateway } from '../gateway';

export async function updateUser(
  ctx: IRequestContext,
  userId: string,
  changes: UpdateUserGatewayChanges
): Promise<User> {
  return UserGateway.updateUser(ctx, userId, changes);
}
