import { CreateDebtServiceData, IDebtDTO } from '../../../../modules/debt/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { debtMapper } from '../../../../modules/debt/debt.mapper';
import { debtService } from '../../../../modules/debt/debt.service';

export async function handler(
  ctx: IRequestContext<CreateDebtServiceData, true>
): Promise<IResponse<{ debt: IDebtDTO }>> {
  const { params, projectId, userId } = ctx;
  const debt = await debtService.createDebt(ctx, projectId, userId, params);

  return {
    body: {
      debt: debtMapper.toDTO(debt),
    },
  };
}
