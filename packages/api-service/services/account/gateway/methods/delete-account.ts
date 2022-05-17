import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';

export async function deleteAccount(ctx: IRequestContext, accountId: string): Promise<void> {
  ctx.log.trace({ accountId }, 'try to delete account');

  await dbRequest(ctx, 'cf.account.destroy', {
    idAccount: Number(accountId),
  });

  ctx.log.info({ accountId }, 'deleted account');
}
