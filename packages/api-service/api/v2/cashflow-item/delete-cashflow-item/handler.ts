import { StatusCodes } from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { cashFlowItemService } from '../../../../modules/cahsflow-item/cashflow-item.service';

export async function handler(ctx: IRequestContext<{ cashFlowItemId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    params: { cashFlowItemId },
  } = ctx;
  await cashFlowItemService.deleteCashFlowItem(ctx, projectId, cashFlowItemId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
