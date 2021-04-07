import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import checkProject from '../../../../common/schemas/check-project';
import { uploader } from './uploader';

import { uploadFilesParamsSchema } from './params.schema';
import { uploadFilesResponseSchema } from './response.schema';

export const uploadFileRouteOptions: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/projects/:projectId/files',
  handler,
  uploader,
  onEnter: async (routerContext, requestContext) => checkProject(requestContext),
  schemas: {
    params: uploadFilesParamsSchema,
    response: uploadFilesResponseSchema,
  },
};
