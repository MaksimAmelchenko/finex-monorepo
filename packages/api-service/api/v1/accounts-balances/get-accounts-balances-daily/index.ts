import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getAccountsBalancesDaily: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/accounts/balances/daily',
  handler,
};
