import { ITransferDTO, UpdateTransferServiceChanges } from '../../../../modules/transfer/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { transferMapper } from '../../../../modules/transfer/transfer.mapper';
import { transferService } from '../../../../modules/transfer/transfer.service';

export async function handler(
  ctx: IRequestContext<UpdateTransferServiceChanges & { transferId: string }, true>
): Promise<IResponse<{ transfer: ITransferDTO }>> {
  const {
    projectId,
    userId,
    params: { transferId, ...changes },
  } = ctx;
  const transfer = await transferService.updateTransfer(ctx, projectId, userId, transferId, changes);

  return {
    body: {
      transfer: transferMapper.toDTO(transfer),
    },
  };
}
