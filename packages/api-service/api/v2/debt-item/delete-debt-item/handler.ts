import * as HttpStatus from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { debtItemService } from '../../../../modules/debt-item/debt-item.service';

export async function handler(ctx: IRequestContext<{ debtItemId: string }>): Promise<INoContent> {
  const {
    projectId,
    params: { debtItemId },
  } = ctx;
  await debtItemService.deleteDebtItem(ctx, projectId, debtItemId);

  return {
    status: HttpStatus.StatusCodes.NO_CONTENT,
  };
}
