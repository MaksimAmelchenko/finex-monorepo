import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { createSubscriptionParamsSchema } from './params.schema';
import { createSubscriptionResponseSchema } from './response.schema';

export const createSubscription: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/billing/subscriptions',
  handler,
  schemas: {
    params: createSubscriptionParamsSchema,
    response: createSubscriptionResponseSchema,
  },
};
