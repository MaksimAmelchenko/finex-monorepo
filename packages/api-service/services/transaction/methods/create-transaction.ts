import { CreateTransactionServiceResponse, CreateTransactionServiceData } from '../types';
import { IRequestContext } from '../../../types/app';
import { TransactionGateway } from '../gateway';

export async function createTransaction(
  ctx: IRequestContext<unknown, true>,
  data: CreateTransactionServiceData
): Promise<CreateTransactionServiceResponse> {
  return TransactionGateway.createTransaction(ctx, data);
}
