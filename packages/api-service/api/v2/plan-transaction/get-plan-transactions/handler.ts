import { IPlanTransactionDTO } from '../../../../modules/plan-transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { planTransactionMapper } from '../../../../modules/plan-transaction/plan-transaction.mapper';
import { planTransactionService } from '../../../../modules/plan-transaction/plan-transaction.service';

export async function handler(
  ctx: IRequestContext<never, true>
): Promise<IResponse<{ planTransactions: IPlanTransactionDTO[] }>> {
  const { projectId } = ctx;

  const planTransactions = await planTransactionService.getPlanTransactions(ctx, projectId);

  return {
    body: {
      planTransactions: planTransactions.map(planTransaction => planTransactionMapper.toDTO(planTransaction)),
    },
  };
}
