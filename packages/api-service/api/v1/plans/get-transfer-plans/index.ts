import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getTransferPlans: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/plans/transfers',
  handler,
};
