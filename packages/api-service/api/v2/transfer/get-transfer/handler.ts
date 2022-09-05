import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ITransferDTO } from '../../../../modules/transfer/types';
import { transferMapper } from '../../../../modules/transfer/transfer.mapper';
import { transferService } from '../../../../modules/transfer/transfer.service';

export async function handler(ctx: IRequestContext<{ transferId: string }, true>): Promise<
  IResponse<{
    transfer: ITransferDTO;
  }>
> {
  const {
    projectId,
    userId,
    params: { transferId },
  } = ctx;

  const transfer = await transferService.getTransfer(ctx, projectId, userId, transferId);

  return {
    body: {
      transfer: transferMapper.toDTO(transfer),
    },
  };
}
