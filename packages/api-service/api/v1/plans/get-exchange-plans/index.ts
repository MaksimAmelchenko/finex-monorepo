import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getExchangePlans: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/plans/exchanges',
  handler,
};
