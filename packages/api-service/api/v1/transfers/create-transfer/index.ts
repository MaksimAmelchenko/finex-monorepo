import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createTransfer: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/cashflows/transfers',
  handler,
};
