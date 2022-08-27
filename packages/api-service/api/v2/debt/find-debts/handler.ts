import { FindDebtsServiceQuery, IDebtDTO } from '../../../../modules/debt/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { debtMapper } from '../../../../modules/debt/debt.mapper';
import { debtService } from '../../../../modules/debt/debt.service';

export async function handler(ctx: IRequestContext<FindDebtsServiceQuery>): Promise<
  IResponse<{
    debts: IDebtDTO[];
    metadata: {
      offset: number;
      limit: number;
      total: number;
    };
  }>
> {
  const { projectId, userId, params } = ctx;
  const { debts, metadata } = await debtService.findDebts(ctx, projectId, userId, params);

  return {
    body: {
      debts: debts.map(debt => debtMapper.toDTO(debt)),
      metadata,
    },
  };
}
