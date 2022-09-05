import * as HttpStatus from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { TransactionService } from '../../../../services/transaction';

export async function handler(ctx: IRequestContext<{ transactionId: string }, true>): Promise<INoContent> {
  const { transactionId } = ctx.params;
  await TransactionService.deleteTransaction(ctx, transactionId);

  return {
    status: HttpStatus.StatusCodes.NO_CONTENT,
  };
}
