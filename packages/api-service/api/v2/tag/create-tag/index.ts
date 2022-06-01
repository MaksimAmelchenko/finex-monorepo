import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createTagParamsSchema } from './params.schema';
import { createTagResponseSchema } from './response.schema';

export const createTag: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/tags',
  handler,
  schemas: {
    params: createTagParamsSchema,
    response: createTagResponseSchema,
  },
};
