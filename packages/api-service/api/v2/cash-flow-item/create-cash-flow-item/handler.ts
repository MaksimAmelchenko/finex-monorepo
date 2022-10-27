import { CreateCashFlowItemServiceData } from '../../../../modules/cash-flow-item/types';
import { ICashFlowItemDTO } from '../../../../modules/cash-flow/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { cashFlowItemMapper } from '../../../../modules/cash-flow-item/cash-flow-item.mapper';
import { cashFlowItemService } from '../../../../modules/cash-flow-item/cash-flow-item.service';

export async function handler(
  ctx: IRequestContext<{ cashFlowId: string } & CreateCashFlowItemServiceData, true>
): Promise<IResponse<{ cashFlowItem: ICashFlowItemDTO }>> {
  const {
    params: { cashFlowId, ...data },
    projectId,
    userId,
  } = ctx;
  const cashFlowItem = await cashFlowItemService.createCashFlowItem(ctx, projectId, userId, cashFlowId, data);

  return {
    body: {
      cashFlowItem: cashFlowItemMapper.toDTO(cashFlowItem),
    },
  };
}
