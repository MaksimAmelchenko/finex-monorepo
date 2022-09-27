import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updatePlanTransactionParamsSchema } from './params.schema';
import { updatePlanTransactionResponseSchema } from './response.schema';

export const updateTransaction: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/plan-transactions/:planId',
  handler,
  schemas: {
    params: updatePlanTransactionParamsSchema,
    response: updatePlanTransactionResponseSchema,
  },
};
