import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { moveCategoryParamsSchema } from './params.schema';
import { moveCategoryResponseSchema } from './response.schema';

export const moveCategory: RestRouteOptions = {
  method: RestMethod.Put,
  uri: '/v2/categories/:categoryId/move',
  handler,
  schemas: {
    params: moveCategoryParamsSchema,
    response: moveCategoryResponseSchema,
  },
};
