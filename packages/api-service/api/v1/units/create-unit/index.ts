import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createUnit: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/units',
  handler,
};
