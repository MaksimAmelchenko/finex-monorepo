import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { findTransactionsParamsSchema } from './params.schema';
import { findTransactionsResponseSchema } from './response.schema';

export const findTransactions: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/transactions',
  handler,
  schemas: {
    params: findTransactionsParamsSchema,
    response: findTransactionsResponseSchema,
  },
};
