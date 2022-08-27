import { CreateDebtItemServiceData, IDebtItemDTO } from '../../../../modules/debt-item/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { debtItemMapper } from '../../../../modules/debt-item/debt-item.mapper';
import { debtItemService } from '../../../../modules/debt-item/debt-item.service';

export async function handler(
  ctx: IRequestContext<{ debtId: string } & CreateDebtItemServiceData>
): Promise<IResponse<{ debtItem: IDebtItemDTO }>> {
  const {
    params: { debtId, ...data },
    projectId,
    userId,
  } = ctx;
  const debtItem = await debtItemService.createDebtItem(ctx, projectId, userId, debtId, data);

  return {
    body: {
      debtItem: debtItemMapper.toDTO(debtItem),
    },
  };
}
