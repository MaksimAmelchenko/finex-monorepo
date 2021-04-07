import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import checkProject from '../../../../common/schemas/check-project';

import { getFileParamsSchema } from './params.schema';

export const getFileRouteOptions: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/projects/:projectId/files/:fileId',
  handler,
  onEnter: async (routerContext, requestContext) => checkProject(requestContext),
  schemas: {
    params: getFileParamsSchema,
  },
};
