import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getProjectsParamsSchema } from './params.schema';
import { getProjectsResponseSchema } from './response.schema';

export const getProjects: RestRouteOptions<never> = {
  method: RestMethod.Get,
  uri: '/v2/projects',
  handler,
  schemas: {
    params: getProjectsParamsSchema,
    response: getProjectsResponseSchema,
  },
};
