import * as HttpStatus from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { transactionService } from '../../../../modules/transaction/transaction.service';

export async function handler(ctx: IRequestContext<{ transactionId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    params: { transactionId },
  } = ctx;
  // TODO What to do with cash flow if it is the last transaction in it ?
  // Does remove it right now or later?
  // The problem is with UI: if we are in cashflow  window and remove the last transaction, but want to create the new one

  await transactionService.deleteTransaction(ctx, projectId, transactionId);

  return {
    status: HttpStatus.StatusCodes.NO_CONTENT,
  };
}
