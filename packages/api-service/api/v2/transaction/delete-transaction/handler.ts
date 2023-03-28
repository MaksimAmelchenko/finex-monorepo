import * as HttpStatus from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { transactionService } from '../../../../modules/transaction/transaction.service';

export async function handler(ctx: IRequestContext<{ transactionId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    params: { transactionId },
  } = ctx;

  await transactionService.deleteTransaction(ctx, projectId, transactionId);

  return {
    status: HttpStatus.StatusCodes.NO_CONTENT,
  };
}
