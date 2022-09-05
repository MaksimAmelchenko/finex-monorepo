import { CreateTransactionServiceData, IPublicTransaction } from '../../../../services/transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { TransactionService } from '../../../../services/transaction';

export async function handler(
  ctx: IRequestContext<CreateTransactionServiceData, true>
): Promise<IResponse<{ transaction: IPublicTransaction }>> {
  const { params } = ctx;
  const transaction = await TransactionService.createTransaction(ctx, params);

  return {
    body: {
      transaction,
    },
  };
}
