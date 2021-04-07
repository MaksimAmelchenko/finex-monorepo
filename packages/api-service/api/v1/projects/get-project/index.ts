import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getProject: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/projects/:idProject',
  handler,
};
