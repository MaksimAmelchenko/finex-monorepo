import { CreatePlanTransactionServiceData, IPlanTransactionDTO } from '../../../../modules/plan-transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { planTransactionMapper } from '../../../../modules/plan-transaction/plan-transaction.mapper';
import { planTransactionService } from '../../../../modules/plan-transaction/plan-transaction.service';

export async function handler(
  ctx: IRequestContext<CreatePlanTransactionServiceData, true>
): Promise<IResponse<{ planTransaction: IPlanTransactionDTO }>> {
  const { projectId, userId, params } = ctx;
  const planTransaction = await planTransactionService.createPlanTransaction(ctx, projectId, userId, params);

  return {
    body: {
      planTransaction: planTransactionMapper.toDTO(planTransaction),
    },
  };
}
