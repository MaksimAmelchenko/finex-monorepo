import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { sortMoneysParamsSchema } from './params.schema';

export const sortMoneys: RestRouteOptions = {
  method: RestMethod.Put,
  uri: '/v2/moneys/sort',
  handler,
  schemas: {
    params: sortMoneysParamsSchema,
  },
};
