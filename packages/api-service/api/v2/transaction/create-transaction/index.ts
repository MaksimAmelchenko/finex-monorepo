import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createTransactionParamsSchema } from './params.schema';
import { createTransactionResponseSchema } from './response.schema';

export const createTransaction: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/transactions',
  handler,
  schemas: {
    params: createTransactionParamsSchema,
    response: createTransactionResponseSchema,
  },
};
