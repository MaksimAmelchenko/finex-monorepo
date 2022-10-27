import { ICashFlowDTO, UpdateCashFlowServiceChanges } from '../../../../modules/cahsflow/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { cashFlowMapper } from '../../../../modules/cahsflow/cashflow.mapper';
import { cashFlowService } from '../../../../modules/cahsflow/cashflow.service';

export async function handler(
  ctx: IRequestContext<UpdateCashFlowServiceChanges & { cashFlowId: string }, true>
): Promise<IResponse<{ cashFlow: ICashFlowDTO }>> {
  const {
    projectId,
    userId,
    params: { cashFlowId, ...changes },
  } = ctx;
  const cashFlow = await cashFlowService.updateCashFlow(ctx, projectId, userId, cashFlowId, changes);

  return {
    body: {
      cashFlow: cashFlowMapper.toDTO(cashFlow),
    },
  };
}
