import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { onEnter } from './on-enter';

export const payPalWebhook: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/billing/paypal-webhook',
  handler,
  onEnter,
  isNeedAuthorization: false,
};
