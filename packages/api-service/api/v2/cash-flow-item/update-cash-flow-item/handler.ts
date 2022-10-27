import { ICashFlowItemDTO, UpdateCashFlowServiceChanges } from '../../../../modules/cash-flow/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { cashFlowItemMapper } from '../../../../modules/cash-flow-item/cash-flow-item.mapper';
import { cashFlowItemService } from '../../../../modules/cash-flow-item/cash-flow-item.service';

export async function handler(
  ctx: IRequestContext<{ cashFlowItemId: string } & UpdateCashFlowServiceChanges, true>
): Promise<IResponse<{ cashFlowItem: ICashFlowItemDTO }>> {
  const {
    projectId,
    params: { cashFlowItemId, ...changes },
  } = ctx;
  const cashFlowItem = await cashFlowItemService.updateCashFlowItem(ctx, projectId, cashFlowItemId, changes);

  return {
    body: {
      cashFlowItem: cashFlowItemMapper.toDTO(cashFlowItem),
    },
  };
}
