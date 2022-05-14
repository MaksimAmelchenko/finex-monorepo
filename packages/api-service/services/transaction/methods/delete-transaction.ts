import { IRequestContext } from '../../../types/app';
import { TransactionGateway } from '../gateway';

export async function deleteTransaction(ctx: IRequestContext, transactionId: string): Promise<void> {
  return TransactionGateway.deleteTransaction(ctx, transactionId);
}
