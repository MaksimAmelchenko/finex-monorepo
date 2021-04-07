import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteTransferPlan: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/plans/transfers/:idPlanTransfer',
  handler,
};
