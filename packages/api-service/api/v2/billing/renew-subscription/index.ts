import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { renewSubscriptionParamsSchema } from './params.schema';

export const renewSubscription: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/billing/subscription/renew',
  handler,
  schemas: {
    params: renewSubscriptionParamsSchema,
  },
};
