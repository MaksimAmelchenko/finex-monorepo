import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createPlanTransactionParamsSchema } from './params.schema';
import { createPlanTransactionResponseSchema } from './response.schema';

export const createPlanTransaction: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/plan-transactions',
  handler,
  schemas: {
    params: createPlanTransactionParamsSchema,
    response: createPlanTransactionResponseSchema,
  },
};
