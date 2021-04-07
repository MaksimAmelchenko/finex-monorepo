import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getDashboardBalances: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/dashboard/balances',
  handler,
};
