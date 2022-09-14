import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ITransactionDTO, UpdateTransactionServiceChanges } from '../../../../modules/transaction/types';
import { transactionMapper } from '../../../../modules/transaction/transaction.mapper';
import { transactionService } from '../../../../modules/transaction/transaction.service';

export async function handler(
  ctx: IRequestContext<UpdateTransactionServiceChanges & { transactionId: string }, true>
): Promise<IResponse<{ transaction: ITransactionDTO }>> {
  const {
    projectId,
    params: { transactionId, ...changes },
  } = ctx;
  const transaction = await transactionService.updateTransaction(ctx, projectId, transactionId, changes);

  return {
    body: {
      transaction: transactionMapper.toDTO(transaction),
    },
  };
}
