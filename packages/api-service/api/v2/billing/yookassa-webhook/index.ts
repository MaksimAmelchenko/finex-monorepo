import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { handler } from './handler';
import { onEnter } from './on-enter';

import { paymentParamsSchema } from './params.schema';

export const yookassaWebhook: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/billing/yookassa-webhook',
  handler,
  schemas: {
    params: paymentParamsSchema,
  },
  onEnter,
  isNeedAuthorization: false,
};
