import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const createProject: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/projects',
  handler,
};
