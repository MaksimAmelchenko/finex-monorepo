import { Account } from '../../model/account';
import { CreateAccountGatewayData } from '../../types';
import { IRequestContext } from '../../../../types/app';

export async function createAccount(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateAccountGatewayData
): Promise<Account> {
  ctx.log.trace({ data }, 'try to create account');

  const { name, accountTypeId, isEnabled = true, note } = data;

  const account = await Account.query(ctx.trx).insertAndFetch({
    idProject: Number(projectId),
    idUser: Number(userId),
    idAccountType: Number(accountTypeId),
    isEnabled,
    name,
    note,
  });

  ctx.log.info({ accountId: String(account.idAccount) }, 'created account');

  return account;
}
