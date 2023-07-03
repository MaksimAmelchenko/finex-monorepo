import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { renewSubscriptionsParamsSchema } from './params.schema';

export const renewSubscriptions: RestRouteOptions = {
  methods: [RestMethod.Get, RestMethod.Post],
  uri: '/v1/billing/subscriptions/renew',
  handler,
  schemas: {
    params: renewSubscriptionsParamsSchema,
  },
  isNeedAuthorization: false,
};
