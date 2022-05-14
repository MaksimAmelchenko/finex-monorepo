import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteTransactionParamsSchema } from './params.schema';

export const deleteTransaction: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/transactions/:transactionId',
  handler,
  schemas: {
    params: deleteTransactionParamsSchema,
  },
};
