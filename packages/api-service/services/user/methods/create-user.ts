import { IRequestContext } from '../../../types/app';
import { IUser, ICreateParams } from '../../../types/user';
import { UserGateway } from '../gateway';

export async function createUser(ctx: IRequestContext, params: ICreateParams): Promise<IUser> {
  return UserGateway.create(ctx, params);
}
