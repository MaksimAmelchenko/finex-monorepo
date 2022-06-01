import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateTagParamsSchema } from './params.schema';
import { updateTagResponseSchema } from './response.schema';

export const updateTag: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/tags/:tagId',
  handler,
  schemas: {
    params: updateTagParamsSchema,
    response: updateTagResponseSchema,
  },
};
