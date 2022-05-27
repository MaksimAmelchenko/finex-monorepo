import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteCategoryParamsSchema } from './params.schema';

export const deleteCategory: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/categories/:categoryId',
  handler,
  schemas: {
    params: deleteCategoryParamsSchema,
  },
};
