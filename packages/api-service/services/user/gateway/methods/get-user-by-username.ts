import { raw } from 'objection';
import { IRequestContext } from '../../../../types/app';
import { User } from '../../model/user';

export async function getUserByUsername(ctx: IRequestContext<any, false>, username: string): Promise<User | undefined> {
  ctx.log.trace({ username }, 'try to get user by username');
  return User.query(ctx.trx).findOne(raw('upper(email) = ?', [username.trim().toUpperCase()]));
}
