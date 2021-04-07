import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getTags: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/tags',
  handler,
};
