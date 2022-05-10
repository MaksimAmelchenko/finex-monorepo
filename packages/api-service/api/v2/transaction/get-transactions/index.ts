import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getTransactionParamsSchema } from './params.schema';
import { getTransactionsResponseSchema } from './response.schema';

export const getTransactions: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/transactions',
  handler,
  schemas: {
    params: getTransactionParamsSchema,
    response: getTransactionsResponseSchema,
  },
};
