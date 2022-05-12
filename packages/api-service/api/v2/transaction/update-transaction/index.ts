import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateTransactionParamsSchema } from './params.schema';
import { updateTransactionResponseSchema } from './response.schema';

export const updateTransaction: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/transactions/:transactionId',
  handler,
  schemas: {
    params: updateTransactionParamsSchema,
    response: updateTransactionResponseSchema,
  },
};
