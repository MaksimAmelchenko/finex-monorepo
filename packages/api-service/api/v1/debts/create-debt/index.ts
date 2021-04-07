import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createDebt: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/cashflows/debts',
  handler,
};
