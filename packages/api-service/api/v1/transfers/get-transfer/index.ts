import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getTransfer: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/transfers/:idTransfer',
  handler,
};
