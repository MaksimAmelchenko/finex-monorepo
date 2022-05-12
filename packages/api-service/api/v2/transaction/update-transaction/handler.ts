import { IPublicTransaction, UpdateTransactionServiceChanges } from '../../../../services/transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { TransactionService } from '../../../../services/transaction';

export async function handler(
  ctx: IRequestContext<UpdateTransactionServiceChanges & { transactionId: string }>
): Promise<IResponse<{ transaction: IPublicTransaction }>> {
  const { transactionId, ...changes } = ctx.params;
  const transaction = await TransactionService.updateTransactions(ctx, transactionId, changes);

  return {
    body: {
      transaction,
    },
  };
}
