import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { cancelSubscriptionParamsSchema } from './params.schema';

export const cancelSubscription: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/billing/subscription/cancel',
  handler,
  schemas: {
    params: cancelSubscriptionParamsSchema,
  },
};
