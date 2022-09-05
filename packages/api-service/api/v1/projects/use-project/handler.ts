import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<{ projectId: string }, true>): Promise<IResponse> {
  const { projectId } = ctx.params;
  const response = await dbRequest(ctx, 'cf.project.use', {
    idProject: projectId,
  });

  return {
    body: response,
  };
}
