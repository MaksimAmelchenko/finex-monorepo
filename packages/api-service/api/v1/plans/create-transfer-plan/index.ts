import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createTransferPlan: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/plans/transfers',
  handler,
};
