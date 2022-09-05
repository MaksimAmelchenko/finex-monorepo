import { CreateTransactionServiceResponse, UpdateTransactionServiceChanges } from '../types';
import { IRequestContext } from '../../../types/app';
import { TransactionGateway } from '../gateway';

export async function updateTransaction(
  ctx: IRequestContext<unknown, true>,
  transactionId: string,
  changes: UpdateTransactionServiceChanges
): Promise<CreateTransactionServiceResponse> {
  return TransactionGateway.updateTransaction(ctx, transactionId, changes);
}
