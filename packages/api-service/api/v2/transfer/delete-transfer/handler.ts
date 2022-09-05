import { StatusCodes } from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { transferService } from '../../../../modules/transfer/transfer.service';

export async function handler(ctx: IRequestContext<{ transferId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    userId,
    params: { transferId },
  } = ctx;
  await transferService.deleteTransfer(ctx, projectId, userId, transferId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
