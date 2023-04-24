import { Account } from '../../model/account';
import { IRequestContext } from '../../../../types/app';
import { getAccounts } from './get-accounts';

export async function getAccount(
  ctx: IRequestContext<unknown, true>,
  projectId: string,
  userId: string,
  accountId: string
): Promise<Account | undefined> {
  ctx.log.trace({ accountId }, 'try to get account');
  const accounts: Account[] = await getAccounts(ctx, projectId, userId);
  return accounts.find(({ idAccount }) => idAccount === Number(accountId));
}
