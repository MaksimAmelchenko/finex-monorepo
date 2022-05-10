import { CreateTransactionServiceResponse, CreateTransactionServiceData } from '../types';
import { IRequestContext } from '../../../types/app';
import { TransactionGateway } from '../gateway';

export async function createTransactions(
  ctx: IRequestContext,
  data: CreateTransactionServiceData
): Promise<CreateTransactionServiceResponse> {
  return TransactionGateway.createTransactions(ctx, data);
}
