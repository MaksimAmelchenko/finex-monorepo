import { IRequestContext } from '../../../../types/app';
import { User } from '../../model/user';

export async function getUser(ctx: IRequestContext, userId: string): Promise<User | undefined> {
  ctx.log.trace({ userId }, 'try to get user');
  return User.query(ctx.trx).findById(Number(userId));
}
