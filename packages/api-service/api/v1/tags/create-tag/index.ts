import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createTag: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/tags',
  handler,
};
