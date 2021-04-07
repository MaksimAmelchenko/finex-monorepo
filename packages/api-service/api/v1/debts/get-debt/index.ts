import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getDebt: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/debts/:idDebt',
  handler,
};
