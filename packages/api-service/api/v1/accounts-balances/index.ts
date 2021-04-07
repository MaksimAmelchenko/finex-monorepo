import { getRestApi } from '../../../libs/rest-api';

import { getAccountsBalances } from './get-accounts-balances';
import { getAccountsBalancesDaily } from './get-accounts-balances-daily';

export const accountsBalancesApi = getRestApi([
  //
  getAccountsBalances,
  getAccountsBalancesDaily,
]);
