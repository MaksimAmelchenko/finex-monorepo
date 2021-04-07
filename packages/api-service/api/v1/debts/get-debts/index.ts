import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getDebts: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/debts',
  handler,
};
