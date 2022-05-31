import { UnitService } from '../../../../services/unit';
import { CreateUnitServiceData, IPublicUnit } from '../../../../services/unit/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<CreateUnitServiceData>): Promise<IResponse<{ unit: IPublicUnit }>> {
  const { params, projectId, userId } = ctx;
  const unit = await UnitService.createUnit(ctx, projectId, userId, params);

  return {
    body: {
      unit: unit.toPublicModel(),
    },
  };
}
