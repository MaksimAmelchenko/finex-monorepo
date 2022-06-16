import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { useProjectParamsSchema } from './params.schema';
import { useProjectResponseSchema } from './response.schema';

export const useProject: RestRouteOptions = {
  method: RestMethod.Put,
  uri: '/v2/projects/:projectId/use',
  handler,
  schemas: {
    params: useProjectParamsSchema,
    response: useProjectResponseSchema,
  },
};
