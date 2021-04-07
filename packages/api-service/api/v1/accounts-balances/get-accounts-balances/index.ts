import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getAccountsBalances: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/accounts/balances',
  handler,
  schemas: {},
};
