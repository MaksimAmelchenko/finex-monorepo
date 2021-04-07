import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteCategoryResponseSchema } from './response.schema';
import { deleteCategoryParamsSchema } from './params.schema';

export const deleteCategory: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/categories/:idCategory',
  handler,
  schemas: {
    params: deleteCategoryParamsSchema,
    response: deleteCategoryResponseSchema,
  },
};
