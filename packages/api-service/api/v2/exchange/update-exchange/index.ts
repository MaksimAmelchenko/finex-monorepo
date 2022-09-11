import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateExchangeParamsSchema } from './params.schema';
import { updateExchangeResponseSchema } from './response.schema';

export const updateExchange: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/exchanges/:exchangeId',
  handler,
  schemas: {
    params: updateExchangeParamsSchema,
    response: updateExchangeResponseSchema,
  },
};
