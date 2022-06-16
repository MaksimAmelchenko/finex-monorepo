import { StatusCodes } from 'http-status-codes';

import { INoContent, IResponse } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { ProjectService } from '../../../../services/project';

export async function handler(ctx: IRequestContext): Promise<IResponse<INoContent>> {
  const { projectId } = ctx.params;
  await ProjectService.deleteProject(ctx, projectId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
