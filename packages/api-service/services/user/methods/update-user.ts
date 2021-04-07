import { IRequestContext } from '../../../types/app';
import { IUser, IUpdateParams } from '../../../types/user';
import { UserGateway } from '../gateway';

export async function updateUser(ctx: IRequestContext, userId: number, params: IUpdateParams): Promise<IUser> {
  return UserGateway.update(ctx, userId, params);
}
