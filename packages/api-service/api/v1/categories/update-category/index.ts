import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateCategoryParamsSchema } from './params.schema';
import { updateCategoryResponseSchema } from './response.schema';

export const updateCategory: RestRouteOptions = {
  methods: [RestMethod.Post, RestMethod.Patch],
  uri: '/v1/categories/:idCategory',
  handler,
  schemas: {
    params: updateCategoryParamsSchema,
    response: updateCategoryResponseSchema,
  },
};
