import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateCategoryParamsSchema } from './params.schema';
import { updateCategoryResponseSchema } from './response.schema';

export const updateCategory: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/categories/:categoryId',
  handler,
  schemas: {
    params: updateCategoryParamsSchema,
    response: updateCategoryResponseSchema,
  },
};
