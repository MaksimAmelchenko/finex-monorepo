import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getIePlans: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/plans/cashflow_items',
  handler,
};
