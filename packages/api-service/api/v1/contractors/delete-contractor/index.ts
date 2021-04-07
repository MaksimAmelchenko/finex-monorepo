import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteContractor: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/contractors/:idContractor',
  handler,
};
