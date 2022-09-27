import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deletePlanTransactionParamsSchema } from './params.schema';

export const deletePlanTransaction: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/plan-transactions/:planId',
  handler,
  schemas: {
    params: deletePlanTransactionParamsSchema,
  },
};
