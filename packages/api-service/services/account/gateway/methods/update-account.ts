import { Account } from '../../model/account';
import { IRequestContext } from '../../../../types/app';
import { IAccount, UpdateAccountGatewayChanges } from '../../types';

export async function updateAccount(
  ctx: IRequestContext<unknown, true>,
  projectId: string,
  accountId: string,
  changes: UpdateAccountGatewayChanges
): Promise<Account> {
  ctx.log.trace({ changes }, 'try to update account');

  const { name, accountTypeId, isEnabled, note } = changes;

  const params: Partial<IAccount> = {
    name,
    isEnabled,
    note,
  };

  if (accountTypeId !== undefined) {
    params.idAccountType = Number(accountTypeId);
  }

  const account = await Account.query(ctx.trx).patchAndFetchById([Number(projectId), Number(accountId)], params);

  ctx.log.info({ accountId }, 'updated account');

  return account;
}
