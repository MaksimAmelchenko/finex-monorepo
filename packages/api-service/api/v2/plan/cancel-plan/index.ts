import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { cancelPlanParamsSchema } from './params.schema';
import { handler } from './handler';

export const cancelPlan: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/plans/:planId/cancel',
  handler,
  schemas: {
    params: cancelPlanParamsSchema,
  },
};
