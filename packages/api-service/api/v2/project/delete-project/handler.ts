import { StatusCodes } from 'http-status-codes';

import { INoContent, IResponse } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { ProjectService } from '../../../../services/project';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse<INoContent>> {
  const {
    userId,
    params: { projectId },
  } = ctx;
  await ProjectService.deleteProject(ctx, projectId, userId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
