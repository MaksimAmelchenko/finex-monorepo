import { CreateCashFlowServiceData, ICashFlowDTO } from '../../../../modules/cash-flow/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { cashFlowMapper } from '../../../../modules/cash-flow/cash-flow.mapper';
import { cashFlowService } from '../../../../modules/cash-flow/cash-flow.service';

export async function handler(
  ctx: IRequestContext<CreateCashFlowServiceData, true>
): Promise<IResponse<{ cashFlow: ICashFlowDTO }>> {
  const { params, projectId, userId } = ctx;
  const cashFlow = await cashFlowService.createCashFlow(ctx, projectId, userId, params);

  return {
    body: {
      cashFlow: cashFlowMapper.toDTO(cashFlow),
    },
  };
}
