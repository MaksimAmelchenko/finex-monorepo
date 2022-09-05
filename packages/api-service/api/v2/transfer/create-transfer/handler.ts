import { CreateTransferServiceData, ITransferDTO } from '../../../../modules/transfer/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { transferMapper } from '../../../../modules/transfer/transfer.mapper';
import { transferService } from '../../../../modules/transfer/transfer.service';

export async function handler(
  ctx: IRequestContext<CreateTransferServiceData, true>
): Promise<IResponse<{ transfer: ITransferDTO }>> {
  const { params, projectId, userId } = ctx;
  const transfer = await transferService.createTransfer(ctx, projectId, userId, params);

  return {
    body: {
      transfer: transferMapper.toDTO(transfer),
    },
  };
}
