import { GetTransactionsServiceQuery, GetTransactionsServiceResponse } from '../../../../services/transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { TransactionService } from '../../../../services/transaction';

export async function handler(
  ctx: IRequestContext<GetTransactionsServiceQuery>
): Promise<IResponse<GetTransactionsServiceResponse>> {
  const { params } = ctx;
  const response = await TransactionService.getTransactions(ctx, params);

  return {
    body: response,
  };
}
