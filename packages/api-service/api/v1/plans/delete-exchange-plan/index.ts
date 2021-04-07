import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteExchangePlan: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/plans/exchanges/:idPlanExchange',
  handler,
};
