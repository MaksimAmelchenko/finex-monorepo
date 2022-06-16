import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteProjectParamsSchema } from './params.schema';

export const deleteProject: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/projects/:projectId',
  handler,
  schemas: {
    params: deleteProjectParamsSchema,
  },
};
