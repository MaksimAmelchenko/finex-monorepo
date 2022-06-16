import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { copyProjectParamsSchema } from './params.schema';
import { copyProjectResponseSchema } from './response.schema';

export const copyProject: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/projects/:projectId/copy',
  handler,
  schemas: {
    params: copyProjectParamsSchema,
    response: copyProjectResponseSchema,
  },
};
