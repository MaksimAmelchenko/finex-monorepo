import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createProjectParamsSchema } from './params.schema';
import { createProjectResponseSchema } from './response.schema';

export const createProject: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/projects',
  handler,
  schemas: {
    params: createProjectParamsSchema,
    response: createProjectResponseSchema,
  },
};
