import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getExchanges: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/exchanges',
  handler,
};
