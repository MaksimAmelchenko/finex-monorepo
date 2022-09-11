import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { findExchangesParamsSchema } from './params.schema';
import { findExchangesResponseSchema } from './response.schema';

export const findExchanges: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/exchanges',
  handler,
  schemas: {
    params: findExchangesParamsSchema,
    response: findExchangesResponseSchema,
  },
};
