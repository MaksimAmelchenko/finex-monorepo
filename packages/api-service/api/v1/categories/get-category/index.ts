import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getCategoriesParamsSchema } from '../get-categories/params.schema';
import { getCategoriesResponseSchema } from '../get-categories/response.schema';

export const getCategory: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/categories/:idCategory',
  handler,
  schemas: {
    params: getCategoriesParamsSchema,
    response: getCategoriesResponseSchema,
  },
};
