import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getContractor: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/contractors/:idContractor',
  handler,
};
