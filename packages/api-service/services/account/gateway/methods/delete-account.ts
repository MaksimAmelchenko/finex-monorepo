import { IRequestContext } from '../../../../types/app';
import { Account } from '../../model/account';

export async function deleteAccount(
  ctx: IRequestContext<unknown, true>,
  projectId: string,
  accountId: string
): Promise<void> {
  ctx.log.trace({ accountId }, 'try to delete account');
  await Account.query(ctx.trx).deleteById([Number(projectId), Number(accountId)]);
  ctx.log.info({ accountId }, 'deleted account');
}
