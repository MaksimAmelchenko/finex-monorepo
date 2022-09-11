import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createExchangeParamsSchema } from './params.schema';
import { createExchangeResponseSchema } from './response.schema';

export const createExchange: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/exchanges',
  handler,
  schemas: {
    params: createExchangeParamsSchema,
    response: createExchangeResponseSchema,
  },
};
