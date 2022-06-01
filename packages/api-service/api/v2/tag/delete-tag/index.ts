import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteTagParamsSchema } from './params.schema';

export const deleteTag: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/tags/:tagId',
  handler,
  schemas: {
    params: deleteTagParamsSchema,
  },
};
