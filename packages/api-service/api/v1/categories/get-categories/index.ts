import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getCategoriesParamsSchema } from './params.schema';
import { getCategoriesResponseSchema } from './response.schema';

export const getCategories: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/categories',
  handler,
  schemas: {
    params: getCategoriesParamsSchema,
    response: getCategoriesResponseSchema,
  },
};
