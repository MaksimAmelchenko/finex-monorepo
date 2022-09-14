import { CreateTransactionAPIData, ITransactionDTO } from '../../../../modules/transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { transactionMapper } from '../../../../modules/transaction/transaction.mapper';
import { transactionService } from '../../../../modules/transaction/transaction.service';

export async function handler(
  ctx: IRequestContext<CreateTransactionAPIData, true>
): Promise<IResponse<{ transaction: ITransactionDTO }>> {
  const {
    projectId,
    userId,
    params: { cashFlowId = null, ...data },
  } = ctx;
  const transaction = await transactionService.createTransaction(ctx, projectId, userId, cashFlowId, data);

  return {
    body: {
      transaction: transactionMapper.toDTO(transaction),
    },
  };
}
