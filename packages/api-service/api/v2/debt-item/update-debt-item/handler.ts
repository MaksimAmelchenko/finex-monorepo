import { IDebtItemDTO } from '../../../../modules/debt-item/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { UpdateDebtServiceChanges } from '../../../../modules/debt/types';
import { debtItemMapper } from '../../../../modules/debt-item/debt-item.mapper';
import { debtItemService } from '../../../../modules/debt-item/debt-item.service';

export async function handler(
  ctx: IRequestContext<{ debtItemId: string } & UpdateDebtServiceChanges>
): Promise<IResponse<{ debtItem: IDebtItemDTO }>> {
  const {
    projectId,
    params: { debtItemId, ...changes },
  } = ctx;
  const debtItem = await debtItemService.updateDebtItem(ctx, projectId, debtItemId, changes);

  return {
    body: {
      debtItem: debtItemMapper.toDTO(debtItem),
    },
  };
}
