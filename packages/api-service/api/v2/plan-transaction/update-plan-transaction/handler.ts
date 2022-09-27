import { IPlanTransactionDTO } from '../../../../modules/plan-transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { UpdateTransactionServiceChanges } from '../../../../modules/transaction/types';
import { planTransactionMapper } from '../../../../modules/plan-transaction/plan-transaction.mapper';
import { planTransactionService } from '../../../../modules/plan-transaction/plan-transaction.service';

export async function handler(
  ctx: IRequestContext<UpdateTransactionServiceChanges & { planId: string }, true>
): Promise<IResponse<{ planTransaction: IPlanTransactionDTO }>> {
  const {
    projectId,
    params: { planId, ...changes },
  } = ctx;
  const planTransaction = await planTransactionService.updatePlanTransaction(ctx, projectId, planId, changes);

  return {
    body: {
      planTransaction: planTransactionMapper.toDTO(planTransaction),
    },
  };
}
