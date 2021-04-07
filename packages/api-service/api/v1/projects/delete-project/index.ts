import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteProject: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/projects/:idProject',
  handler,
};
