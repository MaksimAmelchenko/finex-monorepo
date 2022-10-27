import { ICashFlowItemDTO, UpdateCashFlowServiceChanges } from '../../../../modules/cahsflow/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { cashFlowItemMapper } from '../../../../modules/cahsflow-item/cashflow-item.mapper';
import { cashFlowItemService } from '../../../../modules/cahsflow-item/cashflow-item.service';

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
