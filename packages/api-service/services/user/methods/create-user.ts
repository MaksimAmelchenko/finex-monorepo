import { CreateUserGatewayData } from '../types';
import { IRequestContext } from '../../../types/app';
import { User } from '../model/user';
import { UserGateway } from '../gateway';

export async function createUser(ctx: IRequestContext, data: CreateUserGatewayData): Promise<User> {
  return UserGateway.createUser(ctx, data);
}
