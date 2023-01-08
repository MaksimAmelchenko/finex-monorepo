import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { checkSubscriptionStatusParamsSchema } from './params.schema';
import { checkSubscriptionStatusResponseSchema } from './response.schema';

export const checkSubscriptionStatus: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/billing/subscriptions/:subscriptionId/check-status',
  handler,
  schemas: {
    params: checkSubscriptionStatusParamsSchema,
    response: checkSubscriptionStatusResponseSchema,
  },
};
