import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getTransfers: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/transfers',
  handler,
};
