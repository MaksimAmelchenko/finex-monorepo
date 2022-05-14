import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';

export async function deleteTransaction(ctx: IRequestContext, transactionId: string): Promise<void> {
  ctx.log.trace({ transactionId }, 'try to delete transaction');

  await dbRequest(ctx, 'cf.ieDetail.destroy', {
    idIEDetail: Number(transactionId),
  });

  ctx.log.info({ transactionId }, 'deleted transaction');
}
