import { IRequestContext } from '../../../../types/app';
import { User } from '../../model/user';

export async function getUsers(ctx: IRequestContext, householdId: string): Promise<User[]> {
  ctx.log.trace({ householdId }, 'try to get users');
  return User.query(ctx.trx).where({ idHousehold: Number(householdId) });
}
