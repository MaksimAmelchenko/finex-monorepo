import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getExchangeParamsSchema } from './params.schema';
import { getExchangeResponseSchema } from './response.schema';

export const getExchange: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/exchanges/:exchangeId',
  handler,
  schemas: {
    params: getExchangeParamsSchema,
    response: getExchangeResponseSchema,
  },
};
