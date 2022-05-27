import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createCategoryParamsSchema } from './params.schema';
import { createCategoryResponseSchema } from './response.schema';

export const createCategory: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/categories',
  handler,
  schemas: {
    params: createCategoryParamsSchema,
    response: createCategoryResponseSchema,
  },
};
