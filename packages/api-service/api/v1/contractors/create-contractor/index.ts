import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createContractor: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/contractors',
  handler,
};
