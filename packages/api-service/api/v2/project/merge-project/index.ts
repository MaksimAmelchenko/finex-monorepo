import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { handler } from './handler';
import { mergeProjectParamsSchema } from './params.schema';
import { mergeProjectResponseSchema } from './response.schema';

export const mergeProject: RestRouteOptions = {
  method: RestMethod.Put,
  uri: '/v2/projects/:projectId/merge',
  handler,
  schemas: {
    params: mergeProjectParamsSchema,
    response: mergeProjectResponseSchema,
  },
};
