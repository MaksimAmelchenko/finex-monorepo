import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { getDashboardBalancesParamsSchema } from './params.schema';
import { getDashboardBalancesResponseSchema } from './response.schema';

export const getDashboardBalances: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/dashboard/balances',
  handler,
  schemas: {
    params: getDashboardBalancesParamsSchema,
    response: getDashboardBalancesResponseSchema,
  },
  isNeedAuthorization: true,
};
