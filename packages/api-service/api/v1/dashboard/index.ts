import { getRestApi } from '../../../libs/rest-api';

import { getDashboardBalances } from './get-dashboard-balances';

export const dashboardApi = getRestApi([
  //
  getDashboardBalances,
]);
