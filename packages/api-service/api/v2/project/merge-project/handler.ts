import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { InvalidParametersError } from '../../../../libs/errors';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse> {
  const { params } = ctx;
  const projects = params.projects.filter(projectId => projectId !== params.projectId);
  if (!projects.length) {
    throw new InvalidParametersError('Projects list is empty', { code: 'projectsListIsEmpty' });
  }

  const response = await dbRequest(ctx, 'cf.project.merge', {
    idProject: Number(params.projectId),
    projects: projects.map(Number),
  });
  return {
    body: response,
  };
}
