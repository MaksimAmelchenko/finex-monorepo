import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteUnit: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/units/:idUnit',
  handler,
};
