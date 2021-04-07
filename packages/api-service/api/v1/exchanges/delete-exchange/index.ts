import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteExchange: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/cashflows/exchanges/:idExchange',
  handler,
};
