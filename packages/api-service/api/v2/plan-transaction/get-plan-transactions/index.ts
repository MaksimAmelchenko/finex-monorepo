import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getPlanTransactionsParamsSchema } from './params.schema';
import { getPlanTransactionsResponseSchema } from './response.schema';

export const getPlanTransactions: RestRouteOptions<never> = {
  method: RestMethod.Get,
  uri: '/v2/plan-transactions',
  handler,
  schemas: {
    params: getPlanTransactionsParamsSchema,
    response: getPlanTransactionsResponseSchema,
  },
};
