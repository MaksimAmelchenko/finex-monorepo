import { GetTransactionsServiceQuery, GetTransactionsServiceResponse } from '../types';
import { IRequestContext } from '../../../types/app';
import { TransactionGateway } from '../gateway';

export async function getTransactions(
  ctx: IRequestContext,
  query: GetTransactionsServiceQuery
): Promise<GetTransactionsServiceResponse> {
  return TransactionGateway.getTransactions(ctx, query);
}
