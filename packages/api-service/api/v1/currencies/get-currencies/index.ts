import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getCurrencies: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/currencies',
  handler,
};
