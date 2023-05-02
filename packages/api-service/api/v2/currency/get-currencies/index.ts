import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getCurrenciesParamsSchema } from './params.schema';
import { getCurrenciesResponseSchema } from './response.schema';

export const getCurrencies: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/currencies',
  handler,
  schemas: {
    params: getCurrenciesParamsSchema,
    response: getCurrenciesResponseSchema,
  },
};
