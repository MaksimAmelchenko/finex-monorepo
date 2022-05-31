import { UnitService } from '../../../../services/unit';
import { IPublicUnit } from '../../../../services/unit/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse<{ units: IPublicUnit[] }>> {
  const { projectId } = ctx;
  const units = await UnitService.getUnits(ctx, projectId);

  return {
    body: {
      units: units.map(unit => unit.toPublicModel()),
    },
  };
}
