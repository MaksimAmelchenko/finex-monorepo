import { FindTransfersServiceQuery, ITransferDTO } from '../../../../modules/transfer/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { transferMapper } from '../../../../modules/transfer/transfer.mapper';
import { transferService } from '../../../../modules/transfer/transfer.service';

export async function handler(
  ctx: IRequestContext<
    Omit<FindTransfersServiceQuery, 'fromAccounts' | 'toAccounts' | 'tags'> & {
      fromAccounts: string;
      toAccounts: string;
      tags: string;
    },
    true
  >
): Promise<
  IResponse<{
    transfers: ITransferDTO[];
    metadata: {
      offset: number;
      limit: number;
      total: number;
    };
  }>
> {
  const { projectId, userId } = ctx;
  const { fromAccounts, toAccounts, tags, ...params } = ctx.params;
  const { transfers, metadata } = await transferService.findTransfers(ctx, projectId, userId, {
    ...params,
    fromAccounts: fromAccounts ? fromAccounts.split(',') : undefined,
    toAccounts: toAccounts ? toAccounts.split(',') : undefined,
    tags: tags ? tags.split(',') : undefined,
  });

  return {
    body: {
      transfers: transfers.map(transfer => transferMapper.toDTO(transfer)),
      metadata,
    },
  };
}
