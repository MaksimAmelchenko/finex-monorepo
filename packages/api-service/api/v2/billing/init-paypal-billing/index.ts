import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const initPayPalBilling: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/billing/paypal/init',
  handler,
  isNeedAuthorization: false,
};
