import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getTagsParamsSchema } from './params.schema';
import { getTagsResponseSchema } from './response.schema';

export const getTags: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/tags',
  handler,
  schemas: {
    params: getTagsParamsSchema,
    response: getTagsResponseSchema,
  },
};
