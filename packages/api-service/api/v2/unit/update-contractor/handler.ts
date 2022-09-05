import { UnitService } from '../../../../services/unit';
import { IPublicUnit, UpdateUnitServiceChanges } from '../../../../services/unit/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<UpdateUnitServiceChanges & { unitId: string }, true>
): Promise<IResponse<{ unit: IPublicUnit }>> {
  const {
    projectId,
    params: { unitId, ...changes },
  } = ctx;

  const unit = await UnitService.updateUnit(ctx, projectId, unitId, changes);

  return {
    body: {
      unit: unit.toPublicModel(),
    },
  };
}
