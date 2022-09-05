import { IDebtDTO, UpdateDebtServiceChanges } from '../../../../modules/debt/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { debtMapper } from '../../../../modules/debt/debt.mapper';
import { debtService } from '../../../../modules/debt/debt.service';

export async function handler(
  ctx: IRequestContext<UpdateDebtServiceChanges & { debtId: string }, true>
): Promise<IResponse<{ debt: IDebtDTO }>> {
  const {
    projectId,
    userId,
    params: { debtId, ...changes },
  } = ctx;
  const debt = await debtService.updateDebt(ctx, projectId, userId, debtId, changes);

  return {
    body: {
      debt: debtMapper.toDTO(debt),
    },
  };
}
