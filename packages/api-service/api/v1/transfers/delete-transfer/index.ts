import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteTransfer: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/cashflows/transfers/:idTransfer',
  handler,
};
