import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getDynamicsReport: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/reports/dynamics',
  handler,
};
