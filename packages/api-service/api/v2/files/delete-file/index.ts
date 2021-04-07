import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import checkProject from '../../../../common/schemas/check-project';

import { deleteFileParamsSchema } from './params.schema';
import { deleteFileResponseSchema } from './response.schema';

export const deleteFileRouteOptions: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/projects/:projectId/files/:fileId',
  handler,
  onEnter: async (routerContext, requestContext) => checkProject(requestContext),
  schemas: {
    params: deleteFileParamsSchema,
    response: deleteFileResponseSchema,
  },
};
