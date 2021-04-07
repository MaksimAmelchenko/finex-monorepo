import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteDebt: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/cashflows/debts/:idDebt',
  handler,
};
