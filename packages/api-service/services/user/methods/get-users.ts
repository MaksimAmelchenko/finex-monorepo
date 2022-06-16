import { IRequestContext } from '../../../types/app';
import { User } from '../model/user';
import { UserGateway } from '../gateway';

export async function getUsers(ctx: IRequestContext, householdId: string): Promise<User[]> {
  return UserGateway.getUsers(ctx, householdId);
}
