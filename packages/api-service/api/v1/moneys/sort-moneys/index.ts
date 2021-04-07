import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { sortMoneysParamsSchema } from './params.schema';
import { sortMoneysResponseSchema } from './response.schema';

export const sortMoneys: RestRouteOptions = {
  method: RestMethod.Put,
  uri: '/v1/moneys/sort',
  handler,
  schemas: {
    params: sortMoneysParamsSchema,
    response: sortMoneysResponseSchema,
  },
};
