import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const cancelPlan: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/plans/:idPlan/cancel',
  handler,
};
