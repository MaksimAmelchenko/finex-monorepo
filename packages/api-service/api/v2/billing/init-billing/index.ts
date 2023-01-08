import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const initBilling: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/billing/init',
  handler,
  isNeedAuthorization: false,
};
