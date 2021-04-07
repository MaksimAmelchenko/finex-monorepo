import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteIePlan: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/plans/cashflow_items/:idPlanCashFlowItem',
  handler,
};
