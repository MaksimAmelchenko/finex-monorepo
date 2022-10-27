import { CreateCashFlowItemServiceData } from '../../../../modules/cahsflow-item/types';
import { ICashFlowItemDTO } from '../../../../modules/cahsflow/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { cashFlowItemMapper } from '../../../../modules/cahsflow-item/cashflow-item.mapper';
import { cashFlowItemService } from '../../../../modules/cahsflow-item/cashflow-item.service';

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
