import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getMoneysParamsSchema } from './params.schema';
import { getMoneysResponseSchema } from './response.schema';

export const getMoneys: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/moneys',
  handler,
  schemas: {
    params: getMoneysParamsSchema,
    response: getMoneysResponseSchema,
  },
};
