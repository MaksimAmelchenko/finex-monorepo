import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getDistributionReport: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/reports/distribution',
  handler,
};
