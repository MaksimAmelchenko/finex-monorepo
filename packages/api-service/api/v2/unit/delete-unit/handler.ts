import { StatusCodes } from 'http-status-codes';

import { UnitService } from '../../../../services/unit';
import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';

export async function handler(ctx: IRequestContext<{ unitId: string }, true>): Promise<INoContent> {
  const {
    projectId,
    params: { unitId },
  } = ctx;
  await UnitService.deleteUnit(ctx, projectId, unitId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
