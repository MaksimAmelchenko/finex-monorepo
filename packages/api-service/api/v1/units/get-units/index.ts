import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getUnits: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/units',
  handler,
};
