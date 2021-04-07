import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createIePlan: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/plans/cashflow_items',
  handler,
};
