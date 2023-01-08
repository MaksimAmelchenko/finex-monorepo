import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { updateSubscriptionParamsSchema } from './params.schema';

export const updateSubscription: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v1/billing/subscriptions/:subscriptionId',
  handler,
  schemas: {
    params: updateSubscriptionParamsSchema,
  },
  isNeedAuthorization: true,
};
