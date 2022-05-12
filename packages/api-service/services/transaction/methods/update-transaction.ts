import { CreateTransactionServiceResponse, UpdateTransactionServiceChanges } from '../types';
import { IRequestContext } from '../../../types/app';
import { TransactionGateway } from '../gateway';

export async function updateTransactions(
  ctx: IRequestContext,
  transactionId: string,
  changes: UpdateTransactionServiceChanges
): Promise<CreateTransactionServiceResponse> {
  return TransactionGateway.updateTransactions(ctx, transactionId, changes);
}
