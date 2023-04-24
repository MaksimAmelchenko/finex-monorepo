import { Account } from '../model/account';
import { AccountGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';

export async function getAccount(
  ctx: IRequestContext<unknown, true>,
  projectId: string,
  userId: string,
  accountId: string
): Promise<Account> {
  const account: Account | undefined = await AccountGateway.getAccount(ctx, projectId, userId, accountId);
  if (!account) {
    throw new NotFoundError('Account not found');
  }
  return account;
}
