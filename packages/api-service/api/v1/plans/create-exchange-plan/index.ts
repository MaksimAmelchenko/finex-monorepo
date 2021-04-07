import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createExchangePlan: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/plans/exchanges',
  handler,
};
