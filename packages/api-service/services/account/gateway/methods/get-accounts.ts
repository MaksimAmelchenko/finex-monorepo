import dbRequest from '../../../../libs/db-request';
import { IAccount } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { decodeAccount } from './decode-account';

export async function getAccounts(ctx: IRequestContext): Promise<IAccount[]> {
  ctx.log.trace('try to get accounts');

  const { accounts } = await dbRequest(ctx, 'cf.account.get', {});

  return accounts.map(decodeAccount);
}
