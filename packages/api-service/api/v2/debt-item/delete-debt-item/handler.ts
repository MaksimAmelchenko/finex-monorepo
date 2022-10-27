import * as HttpStatus from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { cashFlowItemService } from '../../../../modules/cash-flow-item/cash-flow-item.service';

export async function handler(ctx: IRequestContext<{ debtItemId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    params: { debtItemId },
  } = ctx;
  await cashFlowItemService.deleteCashFlowItem(ctx, projectId, debtItemId);

  return {
    status: HttpStatus.StatusCodes.NO_CONTENT,
  };
}
