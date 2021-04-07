import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getContractors: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/contractors',
  handler,
};
